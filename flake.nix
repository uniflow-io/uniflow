{
  description = "Uniflow reproducible build environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          php = pkgs.php85;
        in {
          default = pkgs.mkShellNoCC {
            packages = [
              php.packages.composer
              pkgs.nodejs_22
            ];
          };
        });

      formatter = forAllSystems (system:
        (import nixpkgs { inherit system; }).nixfmt-rfc-style);
    };
}
