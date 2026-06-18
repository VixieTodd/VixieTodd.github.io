'use strict';

/**
 * 覆盖主题的菜单高亮逻辑，修复自定义首页+blog子路径时
 * "首页"和"博客"同时高亮的问题。
 */
hexo.extend.helper.register('flatpaper_menu_helpers', function () {
  const ctx = this;

  function children(item) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    var raw = item.item;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map(function (child, index) {
        var isObj = child && typeof child === 'object' && !Array.isArray(child);
        var childText = isObj ? (child.label || child.name || child.title || ('Item ' + (index + 1))) : String(child);
        return { label: childText, item: child };
      });
    }
    if (typeof raw === 'object') {
      return Object.keys(raw).map(function (childLabel) {
        return { label: childLabel, item: raw[childLabel] };
      });
    }
    return [];
  }

  function href(item) {
    var isObj = item && typeof item === 'object' && !Array.isArray(item);
    return isObj ? (item.path || item.href || item.url || item.link || '') : item;
  }

  function icon(item) {
    return (item && typeof item === 'object' && !Array.isArray(item)) ? item.icon : null;
  }

  function text(label, item) {
    return (item && typeof item === 'object' && !Array.isArray(item)) ? (item.label || item.name || item.title || label) : label;
  }

  /**
   * 修复：只有当前页面路径精确匹配时才高亮，避免 /blog/ 页面触发 / 的高亮。
   */
  function active(hrefValue) {
    var hrefPath = String(hrefValue || '').replace(/\/$/, '');
    if (!hrefPath) return false;
    var currentPath = ctx.page.path || '';
    // 移除末尾的 index.html
    currentPath = currentPath.replace(/\/index\.html$/, '').replace(/\/$/, '');
    // 根路径
    if (hrefPath === '') {
      return currentPath === '';
    }
    return currentPath.indexOf(hrefPath) === 0;
  }

  return { children: children, href: href, icon: icon, text: text, active: active };
});
