{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";

    pyproject-nix = {
      url = "github:pyproject-nix/pyproject.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    uv2nix = {
      url = "github:pyproject-nix/uv2nix";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pyproject-build-systems = {
      url = "github:pyproject-nix/build-system-pkgs";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.uv2nix.follows = "uv2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    pydantic-to-typescript-src = {
      url = "github:phillipdupuis/pydantic-to-typescript";
      flake = false;
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    {
      self,
      nixpkgs,
      devenv,
      pyproject-nix,
      uv2nix,
      pyproject-build-systems,
      pydantic-to-typescript-src,
      ...
    }@inputs:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      python = pkgs.python312;

      # Build pydantic-to-typescript from source via uv2nix
      p2tsWorkspace = uv2nix.lib.workspace.loadWorkspace {
        workspaceRoot = pydantic-to-typescript-src;
      };
      p2tsOverlay = p2tsWorkspace.mkPyprojectOverlay { sourcePreference = "wheel"; };
      p2tsPythonSet =
        (pkgs.callPackage pyproject-nix.build.packages { inherit python; }).overrideScope
          (
            nixpkgs.lib.composeManyExtensions [
              pyproject-build-systems.overlays.default
              p2tsOverlay
            ]
          );
      pydantic2tsEnv = p2tsPythonSet.mkVirtualEnv "pydantic2ts-env"
        p2tsWorkspace.deps.default;
    in
    {
      devShells.${system}.default = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          (
            { pkgs, ... }:
            {
              scripts = {
                generate-types = {
                  exec = ''
                    #!/usr/bin/env bash
                    set -e
                    cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
                    ${pydantic2tsEnv}/bin/pydantic2ts \
                      --module timeclock/www/job_time_tracker/models.py \
                      --output timeclock/public/js/job_time_tracker/types.ts \
                      --json2ts-cmd "npx json2ts"
                  '';
                  packages = [ pkgs.nodejs_22 ];
                  description = "Generate TypeScript interfaces from Pydantic models";
                };
              };
            }
          )
        ];
      };
    };
}
