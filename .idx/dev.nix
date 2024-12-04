{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    "angular.ng-template"
    "esbenp.prettier-vscode"
    "cyrilletuzi.angular-schematics"
    "graphql.vscode-graphql"
    "bradlc.vscode-tailwindcss"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
      };
    };
  };
}