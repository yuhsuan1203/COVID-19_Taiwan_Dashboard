# 武漢肺炎疫情 台灣情報站
呈現來自中國武漢病毒所造成的疫情情報
## Website
> https://covid19.tzeng17.com/
  
## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/tw/"><img alt="創用 CC 授權條款" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/3.0/tw/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">武漢肺炎疫情 台灣情報站</span>由<span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">King Tzeng</span>製作<br/>以<a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/tw/">創用CC 姓名標示-非商業性 3.0 台灣 授權條款</a>釋出。

## Software Testing Final Refactor Environment Setup

### Environment
- need Node.js (front end) + Python3 (backend, flask)

### Install the Required Packages
```
$ pip3 install -r requirements
$ npm install
```
### Running the Test
```
$ npm test
$ python3 api/app.test.py
```

### Using Webpack to bundle all the necessary files to `dist` directory
```
$ npm run build
```
- some files may need to manually add to `dist` to let the output website work

### Running the Development Server

#### Using webpack development server
```
$ npm start
```
- You can see the what the website looks like after modifying the frontend code

### Running the flask development server
```
$ export FLASK_APP=./api/app.py
$ flask run
```
- Only serve the files in the `dist/` folder
- Test if the api could work

### Deploy to heroku
- following this guide: [Getting Started on Heroku with Python](https://devcenter.heroku.com/articles/getting-started-with-python)

### Test Coverage
- Open the file in the `./coverage/lcov-report/index.html` in the Chrome. You can see the coverage report.
