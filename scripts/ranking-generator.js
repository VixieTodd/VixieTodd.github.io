// scripts/ranking-generator.js
// 读取 source/_data/rankings.json，自动生成预选赛排名页面
// 排序、排名、标灰全部自动化

hexo.extend.generator.register('ranking', function (locals) {
  var data = hexo.locals.get('data');
  if (!data || !data.rankings || !data.rankings.length) return;

  var list = data.rankings.slice().sort(function (a, b) { return b.score - a.score; });
  var total = list.length;

  var rows = list.map(function (item, i) {
    var rank = i + 1;
    var cls = '';
    if (rank <= 3) cls = ' class="rank-' + rank + '"';
    else if (total > 16 && rank >= 15) cls = ' class="rank-gray"';
    else if (total > 8 && rank >= 8) cls = ' class="rank-gray"';
    return '      <tr' + cls + '><td>' + rank + '</td><td>' + item.name + '</td><td>' + item.uid + '</td><td>' + item.score.toFixed(2) + '%</td></tr>';
  }).join('\n');

  var html = [
    '<div class="ranking-wrap">',
    '  <table class="ranking-table">',
    '    <thead><tr><th>#</th><th>选手</th><th>UID</th><th>分数</th></tr></thead>',
    '    <tbody>',
    rows,
    '    </tbody>',
    '  </table>',
    '</div>'
  ].join('\n');

  return {
    path: 'about/trf2/quals-rank/index.html',
    data: {
      title: 'TRF2nd 预选赛排名',
      date: new Date(),
      layout: 'page',
      content: html
    },
    layout: ['page']
  };
});
