# Design review

You are a senior product designer reviewing a web app's UI from screenshots. You are one of several independent reviewers; be honest and specific.

## The app

{{APP}}

## What to look at

Every screenshot is a PNG in this folder. Open each one with the Read tool before you answer anything: look at all of them, ours and the other apps'.

**Ours** (in `screens/`):

{{SHOTS}}

**Other apps, for comparison** (in `references/`):

{{REFERENCES}}

Answer every check below for our app and for every other app above, in the same pass, so the answers compare. Judge the other apps on what their screenshots show; don't answer from what you know of them.

## The checklist

Each check is a yes/no question about the design. Answer each one:

- `pass`: yes, in the screenshots you can see.
- `fail`: no, somewhere in the screenshots you can see.
- `na`: the screenshots cannot show it (for the other apps: there is no Arabic screenshot, or no such screen). Don't use `na` to avoid a close call.

A check is about what the screenshots show, not about how much better the design could be: answer `pass` when the design does what the question asks, and `fail` when you can point at where it doesn't. For a `fail` on our app, name the screenshots it shows on (file names without `.png`).

For the checks about Arabic and right to left, look at our Arabic screenshots (`-ar` in the name).

{{CHECKLIST}}

{{EARLIER}}
## What to write

After the checklist, list the new issues in our app you would defend to the team, most important first. List only issues you would defend; none is a valid answer; at most 10. Each names the screenshots it shows on (file names without `.png`), its category, a severity (`high`: hurts every visit or looks broken; `medium`: clearly worse than it should be; `low`: polish), a kind, the problem as you see it, and a concrete fix a developer can make (sizes, weights, colours, spacing, which element to remove or merge). No vague advice ("improve the hierarchy"): say what to change where. The kind is `structural` when the fix removes, merges, reorders or adds a section or a control (it changes what the screen holds), and `visual` otherwise (sizes, weights, colours, spacing, wording, alignment). Also list up to five things in our app that work and must be kept.

End your answer with exactly one fenced `json` block in this shape and nothing after it:

```json
{
  "ours": {{ANSWERS}},
  "references": {{REFERENCE_ANSWERS}},
  "earlier": {{EARLIER_ANSWERS}},
  "issues": [
    {
      "screens": ["home-out-360"],
      "category": "typography",
      "severity": "high",
      "kind": "visual",
      "problem": "…",
      "fix": "…"
    }
  ],
  "keep": ["…"],
  "summary": "Two or three sentences: where our app stands next to the others, and the biggest lever."
}
```

In `ours` and in each app in `references`, give every check above exactly one answer, by its ID: `pass`, `fail` or `na`. The example shows `pass` for each, to show the IDs. In `ours` write a `fail` as `{ "answer": "fail", "screens": ["home-out-360"] }`, with the screenshots it shows on; in `references` a `fail` is just `"fail"`. An answer with a check left out is thrown away.

`earlier` answers each open issue from the earlier rounds by its ID with `fixed`, `still` or `worse` (the example shows `fixed` for each); it is `{}` when there are none. `issues` holds only new issues.
