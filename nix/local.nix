# App-specific additions to the managed flake (imported by flake.nix when present).
#
# `generate-types` regenerates employee_timeclock/www/job_timeclock/src/types.ts from the
# Pydantic models in employee_timeclock/www/job_timeclock/models.py. pydantic2ts comes from the
# app's `dev` dependency group, which the dev shell's Python environment installs.
_: {
  perSystem = _: {
    frappe-nix.extraScripts.generate-types = {
      exec = ''
        set -e
        cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
        pydantic2ts \
          --module employee_timeclock/www/job_timeclock/models.py \
          --output employee_timeclock/www/job_timeclock/src/types.ts \
          --json2ts-cmd "npx json2ts"
      '';
      description = "Generate TypeScript interfaces from Pydantic models";
    };
  };
}
