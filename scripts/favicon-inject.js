'use strict';

// Inject favicon into head
hexo.extend.injector.register('head_begin', '<link rel="icon" type="image/svg+xml" href="/favicon.svg">', 'default');
