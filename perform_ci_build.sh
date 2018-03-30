git remote add auth https://cerebraljs:${GH_TOKEN}@github.com/cerebral/cerebral-debugger
git config --global user.email "christianalfoni@gmail.com"
git config --global user.name "Christian Alfoni"
if [[ $TRAVIS_PULL_REQUEST == 'false' ]]; then npm run build;
  if [[ $TRAVIS_OS_NAME == 'linux' ]]; then
    /usr/lib/snapd/snapd
    snap install snapcraft --classic
    npm run package:linux -- --publish=always;
  fi
  if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    npm run package:mac  -- --publish=always;
  fi
  if [[ $? -ne 0 ]] ; then
   exit 1;
  fi
fi
