#!/bin/bash
# SimiJuegos para iPhone: compila la app y la sube a TestFlight en un solo paso.
# Hace falta una Mac con Xcode (las apps de iPhone no se pueden compilar en Windows).
#
# Uso, en la Mac, dentro de esta carpeta:
#     bash subir-a-testflight.sh
#
# Antes, una sola vez: Xcode > Settings > Accounts, entrar con el Apple ID del equipo de Apple Developer
# (equipo A9T5UUZVHZ) que tenga permiso para subir builds.
#
# El número de build sale del proyecto (CURRENT_PROJECT_VERSION). TestFlight pide que sea mayor que el
# último que se subió; para usar otro sin tocar el proyecto:
#     BUILD=32 bash subir-a-testflight.sh
set -euo pipefail
cd "$(dirname "$0")"

TEAM_ID="${TEAM_ID:-A9T5UUZVHZ}"
BUILD="${BUILD:-}"

falta() { echo ""; echo "Falta $1. $2"; exit 1; }
command -v xcodebuild >/dev/null 2>&1 || falta "Xcode" "Instálalo desde la App Store y ábrelo una vez."
command -v node >/dev/null 2>&1 || falta "Node.js" "Instálalo con: brew install node"
command -v pod >/dev/null 2>&1 || falta "CocoaPods" "Instálalo con: brew install cocoapods"

echo "SimiJuegos -> TestFlight"
echo "  Rama: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')   Equipo de Apple: $TEAM_ID   Build: ${BUILD:-el del proyecto}"
echo ""

echo "1/4 Instalando dependencias (unos minutos la primera vez)..."
npm install --no-audit --no-fund

echo "2/4 Preparando el proyecto de iOS..."
(cd ios && pod install)

# Xcode 15.3+ llama "app-store-connect" a la distribución que antes se llamaba "app-store".
XCODE_VERSION="$(xcodebuild -version | head -1 | awk '{print $2}')"
XCODE_MAJOR="${XCODE_VERSION%%.*}"
XCODE_MINOR="$(echo "$XCODE_VERSION" | cut -d. -f2)"
METHOD="app-store-connect"
if [ "$XCODE_MAJOR" -lt 15 ] || { [ "$XCODE_MAJOR" -eq 15 ] && [ "${XCODE_MINOR:-0}" -lt 3 ]; }; then METHOD="app-store"; fi

mkdir -p build
cat > build/ExportOptions.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>$METHOD</string>
  <key>destination</key><string>upload</string>
  <key>signingStyle</key><string>automatic</string>
  <key>teamID</key><string>$TEAM_ID</string>
  <key>uploadSymbols</key><true/>
</dict>
</plist>
EOF

# -allowProvisioningUpdates: Xcode crea o actualiza el perfil de firma por su cuenta, incluido el permiso
# de dominios asociados (Associated Domains) que usan los enlaces de duelo.
EXTRA=()
if [ -n "$BUILD" ]; then EXTRA+=("CURRENT_PROJECT_VERSION=$BUILD"); fi

echo "3/4 Compilando la app (5-10 minutos)..."
xcodebuild \
  -workspace ios/SimiJuegos.xcworkspace \
  -scheme SimiJuegos \
  -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath build/SimiJuegos.xcarchive \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  ${EXTRA[@]+"${EXTRA[@]}"} \
  archive

echo "4/4 Subiendo a App Store Connect (TestFlight)..."
xcodebuild -exportArchive \
  -archivePath build/SimiJuegos.xcarchive \
  -exportOptionsPlist build/ExportOptions.plist \
  -exportPath build/export \
  -allowProvisioningUpdates

echo ""
echo "Listo: se subió el build."
echo "En 5-15 minutos aparece en App Store Connect > SimiJuegos > TestFlight."
echo "Quienes ya estén invitados lo reciben en la app TestFlight de su iPhone."
