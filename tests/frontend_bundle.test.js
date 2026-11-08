// Derlenmiş paket sözdizimi açısından geçerli olmalı (bir yazıdaki kaçmamış kesme işareti bütün paneli boş bırakır). Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
test('the built bundle parses', () => {
  const src = fs.readFileSync(path.join(__dirname, '../custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js'), 'utf8');
  assert.doesNotThrow(() => new vm.Script(src));
});
