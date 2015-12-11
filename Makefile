APP_NAME=artnet2atem
ELECTRON_VERSION=0.35.4
OUTPUT_DIR=build
MAC_BUNDLE_ID=no.trippelm.${APP_NAME}

apps: windows windows-64 mac-64 linux linux-64


clean-apps:
	rm -rf ${OUTPUT_DIR} && mkdir ${OUTPUT_DIR}
windows:
	rm -rf ${OUTPUT_DIR}/win32
	electron-packager . ${APP_NAME} --platform=win32 --arch=ia32 --icon=${OUTPUT_DIR}/../tpmlogo.ico --ignore="/build/" --ignore "node_modules/(karma|babel|gulp-sass|jest-cli|gulp-istanbul|babel-jest|phantomjs|karma-coverage|electron-packager|gulp-autoprefixer|gulp-notify|wiredep|gulp|gulp-clean|gulp-util|del|gulp-load-plugins|gulp-sourcemaps|jasmine-core)" --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}/win32
windows-64:
	rm -rf ${OUTPUT_DIR}/win64
	electron-packager . ${APP_NAME} --platform=win32 --arch=x64 --icon=${OUTPUT_DIR}/../tpmlogo.ico --ignore="/build/" --ignore "node_modules/(karma|babel|gulp-sass|jest-cli|gulp-istanbul|babel-jest|phantomjs|karma-coverage|electron-packager|gulp-autoprefixer|gulp-notify|wiredep|gulp|gulp-clean|gulp-util|del|gulp-load-plugins|gulp-sourcemaps|jasmine-core)" --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}/win64
mac-64:
	rm -rf ${OUTPUT_DIR}/mac64
	electron-packager . ${APP_NAME} --platform=darwin --arch=x64 --ignore="/build/" --app-bundle-id=${MAC_BUNDLE_ID} --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}/mac64 --icon=${OUTPUT_DIR}/../tpmlogo.icns	--ignore "/node_modules/(karma|babel|gulp-sass|jest-cli|gulp-istanbul|babel-jest|phantomjs|karma-coverage|electron-packager|gulp-autoprefixer|gulp-notify|wiredep|gulp|gulp-clean|gulp-util|del|gulp-load-plugins|gulp-sourcemaps|jasmine-core)"
	mkdir ${OUTPUT_DIR}/mac64/artnet2atem-darwin-x64/app
	mv ${OUTPUT_DIR}/mac64/artnet2atem-darwin-x64/artnet2atem.app ${OUTPUT_DIR}/mac64/artnet2atem-darwin-x64/app/artnet2atem.app
	#hdiutil create -volname artnet2atem -srcfolder ${OUTPUT_DIR}/mac64/artnet2atem-darwin-x64/app -ov -format UDZO ${OUTPUT_DIR}/mac64/artnet2atem-darwin-x64/artnet2atem.dmg

linux:
	rm -rf ${OUTPUT_DIR}/linux32
	electron-packager . ${APP_NAME} --platform=linux --arch=ia32 --ignore="/build/" --ignore "node_modules/(karma|babel|gulp-sass|jest-cli|gulp-istanbul|babel-jest|phantomjs|karma-coverage|electron-packager|gulp-autoprefixer|gulp-notify|wiredep|gulp|gulp-clean|gulp-util|del|gulp-load-plugins|gulp-sourcemaps|jasmine-core)" --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}/linux32
linux-64:
	rm -rf ${OUTPUT_DIR}/linux64
	electron-packager . ${APP_NAME} --platform=linux --arch=x64 --ignore="/build/" --ignore "node_modules/(karma|babel|gulp-sass|jest-cli|gulp-istanbul|babel-jest|phantomjs|karma-coverage|electron-packager|gulp-autoprefixer|gulp-notify|wiredep|gulp|gulp-clean|gulp-util|del|gulp-load-plugins|gulp-sourcemaps|jasmine-core)" --version=${ELECTRON_VERSION} --out=${OUTPUT_DIR}/linux64
