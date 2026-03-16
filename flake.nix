{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    devenv.url = "github:cachix/devenv";
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
      ...
    }@inputs:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          (
            { pkgs, config, ... }:
            {
              # This is your devenv configuration
              # packages = [ pkgs.hello ];
              scripts = {
                generate-types = {
                  exec = ''
                    #!/usr/bin/env bash
                    set -e
                    python3 -m pydantic2ts --input apps/timeclock/timeclock/www/job_time_tracker/types/api.py --output apps/timeclock/timeclock/public/js/job_time_tracker/types/api.ts
                  '';
                  packages = [
                    (pkgs.python314.withPackages (
                      ps: with pkgs.python314Packages; [
                        pydantic
                      ]
                    ))
                  ];
                  description = "Generate Typescript types from Pydantic data";
                };
              };
            }
          )
        ];
      };
    };
}
