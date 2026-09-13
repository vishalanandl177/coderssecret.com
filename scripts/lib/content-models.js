const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..', '..');

function loadTsModule(filePath, cache = new Map()) {
  const resolved = path.resolve(filePath);
  if (cache.has(resolved)) return cache.get(resolved).exports;
  const source = fs.readFileSync(resolved, 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  cache.set(resolved, mod);
  const localRequire = request => {
    if (!request.startsWith('.')) return require(request);
    const base = path.resolve(path.dirname(resolved), request);
    const target = [base, `${base}.ts`, `${base}.js`, path.join(base, 'index.ts')]
      .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!target) throw new Error(`Cannot resolve ${request} from ${resolved}`);
    return loadTsModule(target, cache);
  };
  new Function('exports', 'require', 'module', '__filename', '__dirname', js)(
    mod.exports, localRequire, mod, resolved, path.dirname(resolved)
  );
  return mod.exports;
}

function loadPublishedCourses() {
  const cache = new Map();
  const directory = path.join(ROOT, 'src', 'app', 'models', 'courses');
  const { COURSES } = loadTsModule(path.join(directory, 'course-collection.ts'), cache);
  const { MALWARE_ANALYSIS_DEFENSE_COURSE } = loadTsModule(
    path.join(directory, 'malware-analysis-defense.course.ts'), cache
  );
  if (!Array.isArray(COURSES) || !COURSES.length || !MALWARE_ANALYSIS_DEFENSE_COURSE) {
    throw new Error('Course content is missing; refusing to publish an incomplete course inventory.');
  }
  return [...COURSES, MALWARE_ANALYSIS_DEFENSE_COURSE]
    .filter((course, index, all) => all.findIndex(item => item.slug === course.slug) === index)
    .filter(course => course.status === undefined || course.status === 'published');
}

module.exports = { loadTsModule, loadPublishedCourses };
