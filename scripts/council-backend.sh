#!/usr/bin/env bash
# Starts the anonymous LOCAL Convex backend the councils use, pushes the
# functions, writes its URL to a ready file and keeps running until stopped.
# The data is a throwaway copy on this machine: scripts/lib/localApp.ts seeds
# it with invented rows. It never touches a cloud deployment: this script
# refuses to run when a cloud deployment is configured anywhere it looks.
#
# Why the Convex CLI and not the open-source binary: `convex dev` downloads and
# runs that same binary, picks the ports from .convex/local/default/config.json
# and pushes the functions in one step.
#
# Environment (all optional):
#   COUNCIL_CONVEX_PORT       the backend's port (default 3510)
#   COUNCIL_CONVEX_SITE_PORT  its HTTP-actions port (default 3511)
#   COUNCIL_READY_FILE        where the URL is written (default .council/backend.url)
#   COUNCIL_BACKEND_LOG       log file (default .council/backend.log)
#
#   scripts/council-backend.sh          # start (run it in the background)
#   scripts/council-backend.sh stop     # stop the one this checkout started
set -euo pipefail
cd "$(dirname "$0")/.."

ready_file="${COUNCIL_READY_FILE:-.council/backend.url}"
log_file="${COUNCIL_BACKEND_LOG:-.council/backend.log}"
pid_file=.council/backend.pid
mkdir -p .council

if [[ "${1:-}" == "stop" ]]; then
  if [[ -f "$pid_file" ]]; then
    pid="$(cat "$pid_file")"
    kill "$pid" 2>/dev/null && echo "Stopped backend PID $pid." || echo "PID $pid was not running."
    rm -f "$pid_file"
  else
    echo "No $pid_file: no backend started from this checkout."
  fi
  exit 0
fi

# Refuse a cloud deployment: the councils write demo data and sign in without
# Clerk, so they must only ever meet a local backend. Checks the shell and
# every .env* file here (values are never printed).
is_cloud() {
  case "$1" in
    "" | anonymous:* | local:*) return 1 ;;
    *) return 0 ;;
  esac
}
if is_cloud "${CONVEX_DEPLOYMENT:-}"; then
  echo "Refusing to run: CONVEX_DEPLOYMENT in the environment is not a local deployment." >&2
  exit 1
fi
if [[ -n "${CONVEX_URL:-}${CONVEX_SELF_HOSTED_URL:-}${CONVEX_DEPLOY_KEY:-}" ]]; then
  echo "Refusing to run: CONVEX_URL, CONVEX_SELF_HOSTED_URL or CONVEX_DEPLOY_KEY is set." >&2
  exit 1
fi
for env_file in .env .env.local .env.development .env.development.local .env.production .env.production.local; do
  [[ -f "$env_file" ]] || continue
  deployment="$(grep -E '^CONVEX_DEPLOYMENT=' "$env_file" | tail -n1 | cut -d= -f2- | cut -d'#' -f1 | tr -d ' "' || true)"
  if is_cloud "$deployment"; then
    echo "Refusing to run: $env_file names a cloud Convex deployment." >&2
    exit 1
  fi
  if grep -Eq '^CONVEX_(DEPLOY_KEY|SELF_HOSTED_URL)=.+' "$env_file"; then
    echo "Refusing to run: $env_file sets a Convex deploy key or self-hosted URL." >&2
    exit 1
  fi
done

convex_port="${COUNCIL_CONVEX_PORT:-3510}"
convex_site_port="${COUNCIL_CONVEX_SITE_PORT:-3511}"
for port in "$convex_port" "$convex_site_port"; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $port is in use. Stop what holds it, or set COUNCIL_CONVEX_PORT / COUNCIL_CONVEX_SITE_PORT." >&2
    exit 1
  fi
done

export CONVEX_AGENT_MODE=anonymous
local_config=.convex/local/default/config.json
if [[ ! -f "$local_config" ]]; then
  # First run in this checkout: create the anonymous local deployment.
  npx convex dev --once --typecheck disable --codegen disable >/dev/null 2>&1 || true
  pkill -f "$PWD/.convex" 2>/dev/null || true
fi
if [[ -f "$local_config" ]]; then
  node -e '
    const fs = require("fs");
    const [file, cloud, site] = process.argv.slice(1);
    const c = JSON.parse(fs.readFileSync(file, "utf8"));
    c.ports = { cloud: Number(cloud), site: Number(site) };
    fs.writeFileSync(file, JSON.stringify(c));
  ' "$local_config" "$convex_port" "$convex_site_port"
fi

rm -f "$ready_file"
: > "$log_file"

npx convex dev --typecheck disable --codegen disable --tail-logs disable \
  >"$log_file" 2>&1 &
backend_pid=$!
echo "$backend_pid" >"$pid_file"
trap 'kill "$backend_pid" 2>/dev/null || true; rm -f "$pid_file"' EXIT INT TERM HUP

for _ in $(seq 1 180); do
  if grep -q "Convex functions ready" "$log_file"; then break; fi
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    cat "$log_file" >&2
    echo "Convex backend exited before it was ready." >&2
    exit 1
  fi
  sleep 1
done
if ! grep -q "Convex functions ready" "$log_file"; then
  cat "$log_file" >&2
  echo "Timed out waiting for the Convex backend." >&2
  exit 1
fi

url="$(grep -E '^NEXT_PUBLIC_CONVEX_URL=' .env.local | tail -n1 | cut -d= -f2-)"
case "$url" in
  http://127.0.0.1:* | http://localhost:*) ;;
  *)
    echo "Refusing to continue: the backend URL ($url) is not local." >&2
    exit 1
    ;;
esac

echo "$url" | tee "$ready_file"
wait "$backend_pid"
