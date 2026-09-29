'use client'
import { useEffect, useRef, useState } from 'react'
import { Download, Play, RotateCcw } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'
import type { Lang } from '../../lib/i18n'
import { highlight } from '../../lib/highlight'
import LabAI from '../../components/LabAI'
import LabPublish from '../../components/LabPublish'
import { xt } from '../../lib/i18n-extra'

type Files = { html: string; css: string; js: string }
type ExKey = 'hello' | 'counter' | 'loop'
type Tab = 'html' | 'css' | 'js'
type Log = { level: string; text: string }

const exKeys: ExKey[] = ['hello', 'counter', 'loop']
const tabs: Tab[] = ['html', 'css', 'js']
const STORE = 'pasha-lab-v1'

// contoh kode, dengan komentar sesuai bahasa yang dipilih
function makeExample(key: ExKey, lang: Lang): Files {
  const L = (id: string, en: string) => (lang === 'id' ? id : en)

  const baseCss = [
    L('/* CSS: mengatur tampilan */', '/* CSS: controls how things look */'),
    'body {',
    '  font-family: system-ui, sans-serif;',
    '  background: #0b0d10;',
    '  color: #f3f5f8;',
    '  min-height: 100vh;',
    '  margin: 0;',
    '  padding: 24px;',
    '  text-align: center;',
    '}',
    'button {',
    '  padding: 12px 20px;',
    '  border: 0;',
    '  border-radius: 10px;',
    '  background: #7dd3fc;',
    '  font-size: 16px;',
    '  cursor: pointer;',
    '}'
  ].join('\n')

  if (key === 'counter') {
    return {
      html: [
        L('<!-- Angka di bawah akan berubah lewat JavaScript -->', '<!-- The number below is changed by JavaScript -->'),
        '<h1>Counter</h1>',
        '<p id="angka" style="font-size:48px">0</p>',
        '<button id="kurang">-1</button>',
        '<button id="tambah">+1</button>'
      ].join('\n'),
      css: baseCss,
      js: [
        L('// variable: kotak untuk menyimpan angka yang sedang tampil', '// variable: a box that stores the number on screen'),
        'let hitung = 0',
        "const angka = document.getElementById('angka')",
        '',
        L('// function: kumpulan perintah yang bisa dipanggil berkali-kali', '// function: a group of commands you can call many times'),
        'function tampilkan() {',
        '  angka.textContent = hitung',
        '}',
        '',
        L('// saat tombol diklik: ubah variable, lalu update tampilan', '// on click: change the variable, then refresh the screen'),
        "document.getElementById('tambah').addEventListener('click', function () {",
        '  hitung = hitung + 1',
        '  tampilkan()',
        '})',
        "document.getElementById('kurang').addEventListener('click', function () {",
        '  hitung = hitung - 1',
        '  tampilkan()',
        '})'
      ].join('\n')
    }
  }

  if (key === 'loop') {
    return {
      html: [
        L('<!-- List ini masih kosong, diisi otomatis oleh JavaScript -->', '<!-- This list starts empty and is filled by JavaScript -->'),
        '<h1>' + L('Daftar belajar', 'Study list') + '</h1>',
        '<ul id="daftar" style="display:inline-block;text-align:left;font-size:20px"></ul>'
      ].join('\n'),
      css: baseCss,
      js: [
        L('// array: satu variable yang isinya banyak nilai', '// array: one variable holding many values'),
        "const topik = ['HTML', 'CSS', 'JavaScript', 'Next.js']",
        "const daftar = document.getElementById('daftar')",
        '',
        L('// loop: ulangi perintah untuk setiap isi array', '// loop: repeat commands for every item in the array'),
        L('// i mulai dari 0, naik 1 tiap putaran, berhenti saat i sama dengan jumlah isi (4)', '// i starts at 0, goes up by 1 each round, stops when i equals the item count (4)'),
        'for (let i = 0; i < topik.length; i++) {',
        "  const li = document.createElement('li')",
        "  li.textContent = (i + 1) + '. ' + topik[i]",
        '  daftar.appendChild(li)',
        "  console.log('" + L('Menambahkan:', 'Adding:') + "', topik[i])",
        '}'
      ].join('\n')
    }
  }

  return {
    html: [
      L('<!-- Ini HTML: isi dan kerangka halaman -->', '<!-- This is HTML: the content and structure of the page -->'),
      '<h1 id="judul">' + L('Halo, dunia!', 'Hello, world!') + ' 👋</h1>',
      '<p>' + L('Ubah kode di sini, hasilnya langsung berubah.', 'Change the code and the result updates instantly.') + '</p>',
      '<button id="tombol">' + L('Klik aku', 'Click me') + '</button>'
    ].join('\n'),
    css: baseCss,
    js: [
      L('// Ini JavaScript: bikin halaman bisa bereaksi', '// This is JavaScript: it makes the page react'),
      L("// 'let' membuat variable, yaitu kotak untuk menyimpan nilai", "// 'let' creates a variable, a box that stores a value"),
      "let nama = 'Pasha'",
      "const judul = document.getElementById('judul')",
      '',
      L('// function: kumpulan perintah yang dijalankan saat dipanggil', '// function: a group of commands that runs when called'),
      'function sapa() {',
      "  judul.textContent = '" + L('Halo, ', 'Hello, ') + "' + nama + '! 🚀'",
      "  console.log('" + L('Tombol diklik!', 'Button clicked!') + "')",
      '}',
      '',
      L('// saat tombol diklik, jalankan function sapa', '// when the button is clicked, run the sapa function'),
      "document.getElementById('tombol').addEventListener('click', sapa)"
    ].join('\n')
  }
}

// jembatan kecil: kirim console.log dan error dari iframe ke panel Console
const BRIDGE = `<script>
(function(){
  function fmt(a){try{return (typeof a==='object'&&a!==null)?JSON.stringify(a):String(a)}catch(e){return String(a)}}
  function send(level,args){try{parent.postMessage({__lab:true,level:level,text:Array.prototype.map.call(args,fmt).join(' ')},'*')}catch(e){}}
  ['log','info','warn','error'].forEach(function(l){var o=console[l];console[l]=function(){send(l,arguments);o.apply(console,arguments)}});
  window.addEventListener('error',function(e){send('error',[e.message])});
  window.addEventListener('unhandledrejection',function(e){send('error',['Promise: '+(e.reason&&e.reason.message||e.reason)])});
})();
<\/script>`

function buildDoc(f: Files, bridge: boolean) {
  const css = f.css.replace(/<\/style/gi, '<\\/style')
  const js = f.js.replace(/<\/script/gi, '<\\/script')
  return (
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    (bridge ? BRIDGE : '') +
    '<style>' + css + '</style></head><body>' + f.html + '<script>' + js + '<\/script></body></html>'
  )
}

const same = (a: Files, b: Files) => a.html === b.html && a.css === b.css && a.js === b.js

export default function LabPage() {
  const { t, lang } = useLang()
  const l = t.lab
  const [exKey, setExKey] = useState<ExKey>('hello')
  const [files, setFiles] = useState<Files>(() => makeExample('hello', 'id'))
  const [tab, setTab] = useState<Tab>('html')
  const [view, setView] = useState<'code' | 'result'>('code')
  const [auto, setAuto] = useState(true)
  const [doc, setDoc] = useState('')
  const [logs, setLogs] = useState<Log[]>([])
  const [loaded, setLoaded] = useState(false)
  const hl = useRef<HTMLPreElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  // ambil kode yang tersimpan di browser (kalau ada)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE)
      if (raw) {
        const d = JSON.parse(raw)
        if (d && typeof d.html === 'string' && typeof d.css === 'string' && typeof d.js === 'string') {
          setFiles({ html: d.html, css: d.css, js: d.js })
          if (exKeys.includes(d.exKey)) setExKey(d.exKey)
        }
      }
    } catch {}
    setLoaded(true)
  }, [])

  // simpan otomatis
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORE, JSON.stringify({ ...files, exKey }))
    } catch {}
  }, [files, exKey, loaded])

  const run = () => {
    setLogs([])
    setDoc(buildDoc(files, true))
  }

  // jalan otomatis 0,6 detik setelah berhenti mengetik
  useEffect(() => {
    if (!loaded || !auto) return
    const timer = setTimeout(() => {
      setLogs([])
      setDoc(buildDoc(files, true))
    }, 600)
    return () => clearTimeout(timer)
  }, [files, auto, loaded])

  // terima console.log dari iframe
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return
      const d = e.data
      if (d && d.__lab) setLogs(prev => [...prev.slice(-199), { level: String(d.level), text: String(d.text) }])
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const setCode = (v: string) => setFiles(f => ({ ...f, [tab]: v }))

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const s = el.selectionStart
      const end = el.selectionEnd
      setCode(el.value.slice(0, s) + '  ' + el.value.slice(end))
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2
      })
    }
  }

  const pristine = () => (['id', 'en'] as const).some(x => same(files, makeExample(exKey, x)))

  const loadExample = (k: ExKey) => {
    if (!pristine() && !window.confirm(l.confirmReset)) return
    setExKey(k)
    setFiles(makeExample(k, lang))
  }

  const reset = () => {
    if (!pristine() && !window.confirm(l.confirmReset)) return
    setFiles(makeExample(exKey, lang))
  }

  // dipanggil komponen AI: ganti kode di editor (tanya dulu kalau kode sudah diubah pengguna)
  const applyAI = (f: Files) => {
    if (!pristine() && !window.confirm(xt[lang].ai.confirmReplace)) return false
    setFiles(f)
    setTab('html')
    return true
  }

  const download = () => {
    const blob = new Blob([buildDoc(files, false)], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pasha-lab.html'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="page container lab-page">
      <PageHeader kicker={l.kicker} title={l.title} />
      <p className="lab-hint">{l.hint}</p>

      <div className="lab-bar">
        <label className="lab-sel">
          <span>{l.examples}</span>
          <select value={exKey} onChange={e => loadExample(e.target.value as ExKey)}>
            {exKeys.map(k => <option key={k} value={k}>{l.ex[k]}</option>)}
          </select>
        </label>
        <div className="lab-actions">
          <button className="btn btn-primary btn-sm" onClick={run}><Play size={15} /> {l.run}</button>
          <label className="lab-auto">
            <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} /> {l.auto}
          </label>
          <button className="btn btn-ghost btn-sm" onClick={download}><Download size={15} /> {l.download}</button>
          <LabPublish getHtml={() => buildDoc(files, false)} />
          <button className="btn btn-ghost btn-sm" onClick={reset}><RotateCcw size={15} /> {l.reset}</button>
        </div>
      </div>

      <div className="lab-switch" role="tablist">
        <button className={view === 'code' ? 'on' : ''} onClick={() => setView('code')}>{l.code}</button>
        <button className={view === 'result' ? 'on' : ''} onClick={() => setView('result')}>{l.result}</button>
      </div>

      <div className="lab-grid">
        <section className={'lab-pane' + (view === 'code' ? ' show' : '')}>
          <div className="lab-tabs" role="tablist">
            {tabs.map(x => (
              <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? 'on' : ''} onClick={() => setTab(x)}>
                {l.tabs[x]}
              </button>
            ))}
          </div>
          <div className="lab-ed">
          <pre className="lab-hl" ref={hl} aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlight(files[tab], tab) }} />
          <textarea
            className="lab-code"
            onScroll={e => { if (hl.current) { hl.current.scrollTop = e.currentTarget.scrollTop; hl.current.scrollLeft = e.currentTarget.scrollLeft } }}
            value={files[tab]}
            onChange={e => setCode(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label={l.tabs[tab]}
          />
          </div>
        </section>

        <section className={'lab-pane' + (view === 'result' ? ' show' : '')}>
          <div className="lab-head">{l.result}</div>
          <iframe
            ref={frameRef}
            className="lab-frame"
            title={l.result}
            sandbox="allow-scripts allow-modals allow-forms"
            srcDoc={doc}
          />
          <div className="lab-console">
            <div className="lab-head">
              <span>{l.console}</span>
              <button onClick={() => setLogs([])}>{l.clear}</button>
            </div>
            <div className="lab-logs">
              {logs.length === 0 ? (
                <p className="lab-empty">{l.consoleEmpty}</p>
              ) : (
                logs.map((g, i) => <div key={i} className={'log ' + g.level}>{g.text}</div>)
              )}
            </div>
          </div>
        </section>
      </div>

      <LabAI files={files} tab={tab} logs={logs} onApply={applyAI} />
    </div>
  )
}
