import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";

/**
 * A custom hook that accepts a MUI breakpoint (or a custom query)
 * and returns whether the current screen size matches that breakpoint.
 *
 * @param {string} query MUI breakpoint or custom media query.
 * @returns {boolean} True if the current screen size matches the query.
 */
function useResponsiveBreakpoint(query: number | Breakpoint, down?: boolean) {
  const theme = useTheme();
  const matches = useMediaQuery(
    down ? theme.breakpoints.down(query) : theme.breakpoints.up(query)
  );

  return matches;
}

export default useResponsiveBreakpoint;
