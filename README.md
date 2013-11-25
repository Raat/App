APP
===

A web base application structure, containing:

> APP namespace
>
> Anonymous self-invoking function
>
> Micro libraries

Quo.js = AJAX get data from leaguevine api
Quo.js: http://quojs.tapquo.com/

Routie.js = Link handler
Routie: http://projects.jga.me/routie/

Transparency.js = Template engine
Transparency: https://github.com/leonidas/transparency

Qwery.js = Qwery handler
Qwery: http://www.dustindiaz.com/qwery

-----

APP = Namespace
-----

APP.directives = Transparency template rendering

APP.controller = Kickstart application

APP.router = Link handler
- init: Link handler
- change: Change class active

APP.page = Page handler
- home: page
- game: page
- updateGame: page
- ranking: page

APP.post = Post data to Leaguevine api
- updateGame 

APP.loader = Loader
- start: loader
- stop: loader

APP.domready = Start application when dom is ready


