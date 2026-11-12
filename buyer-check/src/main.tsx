import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clipboard, RotateCcw, ScanSearch, Sparkles } from 'lucide-react';
import { analyze, checklist, type Device } from './analysis';
import { brandSuggestions, devices, modelSuggestions } from './catalog';
import { recognizeListing } from './recognize';
import { checklistDetails } from './checklist-details';
import { brandGuides } from './brand-guides';
import { appleEsimGuidance, appleRegionGuidance, appleRegionIdentification, phoneRegions, type PhoneRegion } from './phone-region';
import './style.css';

type Step = 1 | 2 | 3;
type CheckState = '未检查' | '一致' | '不一致' | '不适用';
const example = 'MacBook Pro M1 Pro，内存 16GB，存储 512GB。\n卖家描述：自用，外观有轻微划痕，无拆修。\n包含充电器，其他信息请咨询卖家。';
const sampleReply = '内存 16GB，存储 512GB，电池循环 320 次。';
const stepNames = ['商品信息', '问卖家', '到货核对'];

function App() {
  const [step, setStep] = useState<Step>(1);
  const [reached, setReached] = useState<Step>(1);
  const [skipped, setSkipped] = useState<Partial<Record<Step, boolean>>>({});
  const [device, setDevice] = useState<Device>('laptop');
  const [selections, setSelections] = useState<Partial<Record<Device, { brand: string; model: string }>>>({});
  const [phoneRegion, setPhoneRegion] = useState<PhoneRegion>('');
  const [listing, setListing] = useState('');
  const [reply, setReply] = useState('');
  const [observed, setObserved] = useState('');
  const [link, setLink] = useState('');
  const [checksByItem, setChecksByItem] = useState<Record<string, Record<string, CheckState>>>({});
  const [copied, setCopied] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState('');
  const [recognitionMessage, setRecognitionMessage] = useState('');
  const selection = selections[device] ?? { brand: '', model: '' };
  const result = useMemo(() => analyze({ device, listing, reply, observed, selectedModel: selection.model }), [device, listing, reply, observed, selection.model]);
  const brandGuide = brandGuides(device, selection.brand, selection.model);
  const isApplePhone = device === 'phone' && !brandGuide.mismatch && brandGuide.label === '苹果';
  const selectedPhoneRegion = device === 'phone' && phoneRegions(isApplePhone).includes(phoneRegion) ? phoneRegion : '';
  const regionGuide = isApplePhone ? appleRegionGuidance(selectedPhoneRegion, selection.model) : undefined;
  const esimGuide = isApplePhone ? appleEsimGuidance(selectedPhoneRegion, selection.model) : undefined;
  const regionIdentification = isApplePhone ? appleRegionIdentification(selectedPhoneRegion, selection.model) : undefined;
  const checkKey = JSON.stringify([device, selection.brand.normalize('NFKC').trim().toLowerCase(), selection.model.normalize('NFKC').trim().toLowerCase(), selectedPhoneRegion, listing.trim(), link.trim()]);
  const checks = checksByItem[checkKey] ?? {};
  const brands = brandSuggestions(device);
  const models = modelSuggestions(device, selection.brand);
  const deviceLabel = devices.find(item => item.id === device)?.label ?? '其他数码设备';
  const conflicts = result.rows.filter(row => row.conflict || row.uncertain);
  const recorded = Object.values(checks).filter(value => value !== '未检查').length;
  const hasInput = Boolean(listing.trim() || reply.trim() || observed.trim() || selection.brand.trim() || selection.model.trim());

  useEffect(() => {
    document.querySelector<HTMLHeadingElement>('#step-heading')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, finished]);

  function goTo(next: Step, wasSkipped = false) {
    setSkipped(previous => ({ ...previous, [step]: wasSkipped }));
    setReached(previous => Math.max(previous, next) as Step);
    setFinished(false); setMessage(''); setStep(next);
  }
  function previous(next: Step) { setFinished(false); setMessage(''); setStep(next); }
  function nextFromFirst() {
    if (!listing.trim() && !selection.brand.trim() && !selection.model.trim()) { setMessage('请填写品牌、型号或商品描述，也可以选择跳过。'); document.querySelector<HTMLInputElement>('#brand')?.focus(); return; }
    goTo(2);
  }
  function loadExample() {
    if ((listing || reply || observed || link || Object.values(selections).some(item => item?.brand || item?.model)) && !window.confirm('载入示例会替换当前输入，确定继续吗？')) return;
    setPhoneRegion(''); setDevice('laptop'); setSelections({ laptop: { brand: '苹果 Apple', model: 'MacBook Pro 14 英寸 M1 Pro' } }); setListing(example); setReply(sampleReply); setObserved(''); setLink(''); setChecksByItem({});
    setIsExample(true); setRecognitionMessage(''); setMessage('虚构示例已填入，可以继续下一步。');
  }
  function reset() {
    if (!window.confirm('确定清空本次的所有输入和核对记录吗？')) return;
    setListing(''); setReply(''); setObserved(''); setLink(''); setChecksByItem({}); setSelections({}); setPhoneRegion(''); setDevice('laptop'); setIsExample(false);
    setSkipped({}); setStep(1); setReached(1); setFinished(false); setRecognitionMessage(''); setMessage('已清空。');
  }
  async function copyQuestions() {
    try { await navigator.clipboard.writeText(result.sellerQuestions.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { setMessage('复制失败，请手动选择并复制问题。'); }
  }
  function chooseDevice(next: Device) {
    if (next !== device && (listing.trim() || reply.trim() || observed.trim())) setMessage('设备类型已切换，原有描述和回复仍保留，请核对是否适用于当前商品。');
    else setMessage('');
    if (next !== device) setPhoneRegion('');
    setDevice(next);
  }
  function updateSelection(key: 'brand' | 'model', value: string) {
    if (key === 'brand' && value !== selection.brand || key === 'model' && device === 'phone' && (brandGuides('phone', selection.brand, value).label === '苹果') !== isApplePhone) setPhoneRegion('');
    setSelections(previous => ({ ...previous, [device]: { ...(previous[device] ?? { brand: '', model: '' }), [key]: value } }));
    setMessage(key === 'brand' && selection.model.trim() ? '型号已保留；更换品牌后请核对型号是否匹配。' : '');
  }
  function recognize() {
    if (!listing.trim()) { setRecognitionMessage('请先输入商品标题或描述。'); document.querySelector<HTMLTextAreaElement>('#listing')?.focus(); return; }
    const result = recognizeListing(listing);
    if (!result.device) { setRecognitionMessage(result.ambiguous ? '描述中出现多种设备，无法确定商品类型，请手动选择。' : '暂未识别出设备类型，请手动选择并填写。'); return; }
    const saved = selections[result.device];
    const retainedModel = !result.model && saved?.model && result.brand && saved.brand !== result.brand;
    setPhoneRegion('');
    setDevice(result.device);
    setSelections(previous => ({ ...previous, [result.device!]: { ...(previous[result.device!] ?? { brand: '', model: '' }), ...(result.brand ? { brand: result.brand } : {}), ...(result.model ? { model: result.model } : {}) } }));
    const filled = ['设备类型', result.brand && '品牌', result.model && '型号'].filter(Boolean).join('、');
    const missing = [!result.brand && '品牌', !result.model && '型号'].filter(Boolean).join('、');
    setRecognitionMessage(`已填入${filled}。${missing ? `${missing}未识别，请自行填写。` : ''}${retainedModel ? '原型号已保留，请检查是否与新品牌匹配。' : ''}${result.unlistedModel ? '型号来自描述，未匹配内置目录，请核对机身铭牌。' : '请核对所填信息与商品是否一致。'}`);
    setMessage('');
  }
  function finish(wasSkipped: boolean) { setSkipped(previous => ({ ...previous, 3: wasSkipped })); setMessage(''); setFinished(true); }

  return <>
    <header className="topbar"><div className="topbar-inner">
      <div className="brand"><span className="brandmark"><ScanSearch size={19}/></span><span>买前看</span></div>
      <span className="local-indicator"><span aria-hidden="true"/>本地演示</span>
    </div></header>

    <main className="container">
      <div className="intro"><h1>买之前，<br/><span>先看清楚。</span></h1><p>看商品、问卖家、收到再核对。<br/>三步走，把该问的弄明白。</p><div className="intro-note"><Check size={14} aria-hidden="true"/> 给二手数码买家的一份小帮手</div></div>
      <nav className="steps" aria-label="核对步骤">
        {stepNames.map((name, index) => {
          const number = (index + 1) as Step;
          const active = number === step;
          const available = number <= reached;
          return <button key={number} className={`step ${active ? 'active' : ''} ${number < step ? 'visited' : ''}`} disabled={!available} aria-current={active ? 'step' : undefined} onClick={() => previous(number)}>
            <span className="step-number">{number < step && !skipped[number] ? <Check size={15}/> : number}</span><span className="step-name">{name}</span>{number < 3 && <span className="step-line" aria-hidden="true"/>}
          </button>;
        })}
      </nav>

      <section key={`${step}-${finished}`} className="card" aria-labelledby="step-heading">
        {isExample && <div className="example-notice">当前包含虚构示例内容，请勿作为真实商品信息。</div>}

        {step === 1 && <>
          <div className="card-heading"><div><span className="step-caption">第一步 / 3</span><h2 id="step-heading" tabIndex={-1}>这是什么商品？</h2><p>先选类型、品牌和型号，找不到也可以自己输入。</p></div><button className="text-button sample" onClick={loadExample}><Sparkles size={15}/> 试试示例</button></div>
          <label className="field-label" htmlFor="device">设备类型</label>
          <div className="select-wrap"><select id="device" value={device} onChange={e => chooseDevice(e.target.value as Device)}>{devices.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select><ChevronDown size={16}/></div>
          <div className="identity-fields"><div><label className="field-label" htmlFor="brand">品牌</label><input id="brand" list="brand-options" value={selection.brand} onChange={e => updateSelection('brand', e.target.value)} placeholder="搜索或输入品牌" maxLength={100} autoComplete="off"/><datalist id="brand-options">{brands.map(brand => <option value={brand} key={brand}/>)}</datalist></div>
          <div><label className="field-label" htmlFor="model">型号</label><input id="model" list="model-options" value={selection.model} onChange={e => updateSelection('model', e.target.value)} placeholder={selection.brand.trim() ? '搜索或输入型号' : '先输入品牌，或直接输入型号'} maxLength={150} autoComplete="off"/><datalist id="model-options">{models.map(model => <option value={model} key={model}/>)}</datalist></div></div>
          <p className="hint identity-hint">内置常见型号供参考，也可手动输入。具体配置请以实物为准。</p>
          {device === 'phone' && (selection.brand.trim() || isApplePhone) && <div className="phone-region"><label className="field-label" htmlFor="phone-region">销售地区版本 <span className="optional-label">选填，待核实</span></label><div className="select-wrap"><select id="phone-region" value={selectedPhoneRegion} onChange={e => setPhoneRegion(e.target.value as PhoneRegion)}><option value="">未确认</option>{phoneRegions(isApplePhone).map(region => <option key={region} value={region}>{region}</option>)}</select><ChevronDown size={16}/></div><p className="hint">{isApplePhone ? '按卖家描述选择，欧版需进一步确认具体国家。' : '安卓手机目前仅记录国行；请先向卖家核实。'}</p></div>}
          <label className="field-label description-label" htmlFor="listing">商品描述 <span className="optional-label">选填</span></label>
          <textarea id="listing" value={listing} onChange={e => {setListing(e.target.value); setMessage(''); setRecognitionMessage('');}} placeholder={'粘贴商品标题和卖家描述\n例如：MacBook Pro M1，内存 16GB，存储 512GB'} maxLength={12000}/>
          <div className="recognize-row"><p className="hint">请先遮挡姓名、电话、地址和完整序列号。</p><button className="outline-button recognize-button" type="button" onClick={recognize}>确认并识别</button></div>
          <p className="recognition-status" role="status">{recognitionMessage}</p>
          <details className="disclosure"><summary>闲鱼链接 <span>暂不支持自动读取</span><ChevronDown size={15}/></summary><div className="disclosure-body"><label className="field-label" htmlFor="link">分享链接或文字</label><input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder="可在此暂存链接" maxLength={2000}/><p className="hint">目前不会读取链接内容，请先粘贴商品描述。</p></div></details>
          <p className="status-line" role="status">{message}</p>
          <div className="actions"><button className="skip-button" onClick={() => goTo(2, true)}>跳过这一步</button><button className="primary-button" onClick={nextFromFirst}>下一步 <ArrowRight size={16}/></button></div>
        </>}

        {step === 2 && <>
          <div className="card-heading"><div><span className="step-caption">第二步 / 3</span><h2 id="step-heading" tabIndex={-1}>这些可以问卖家</h2><p>根据已填内容，整理还需要确认的问题。</p></div></div>
          {(selection.brand.trim() || selection.model.trim()) && <div className="selected-product"><span>你填写的商品</span><strong>{[deviceLabel, selection.brand, selection.model, selectedPhoneRegion ? `${selectedPhoneRegion}（待核实）` : ''].filter(Boolean).join(' / ')}</strong><small>型号尚需与卖家描述和实物核对</small></div>}
          {!listing.trim() && <div className="notice">还没有填写商品描述。以下为通用待确认问题；你也可以返回上一步补充。</div>}
          {hasInput ? <>
            <div className="list-heading"><h3>待确认的问题 <span>{result.followups.length} 条</span></h3>{result.sellerQuestions.length > 0 && <button className="outline-button copy-button" onClick={copyQuestions}><Clipboard size={15}/>{copied ? '已复制' : '复制问题'}</button>}</div>
            <p className="risk-explanation">颜色表示核对优先级，不代表已经确认风险或商品安全。</p>
            <div className="question-list">{result.followups.length ? result.followups.map((question, index) => <div className="question" key={question}><span>{String(index + 1).padStart(2, '0')}</span><p><b className={`risk-badge ${result.priorityQuestions.includes(question) ? 'risk-red' : 'risk-yellow'}`}>{result.priorityQuestions.includes(question) ? '优先确认' : '待核实'}</b>{question}</p></div>) : <p className="hint no-questions">当前规则没有发现新的问题，请继续自行核对。</p>}</div>
            {result.mentioned.length > 0 && <p className="mentioned"><b className="risk-badge risk-green">已提及</b>商品描述中提到{result.mentioned.join('、')}，仍需与卖家及实物核对。</p>}
          </> : <div className="empty">填入商品描述后，这里会出现针对已识别信息的问题。</div>}
          <details className="disclosure optional"><summary>补充卖家的回复 <span>选填</span><ChevronDown size={15}/></summary><div className="disclosure-body"><label className="field-label" htmlFor="reply">卖家回复</label><textarea className="compact" id="reply" value={reply} onChange={e => setReply(e.target.value)} placeholder="粘贴卖家的回复，系统会重新对照" maxLength={12000}/><p className="hint">目前只识别部分明确的文字，结果请自行复核。</p></div></details>
          {hasInput && <details className="disclosure"><summary>查看已识别的信息 <ChevronDown size={15}/></summary><div className="disclosure-body fact-list">{result.rows.map(row => <div className="fact-row" key={row.key}><span className="fact-label">{row.label}</span><div>{row.items.length ? row.items.map((item, index) => <div className="fact-item" key={`${item.source}-${index}`}><small>{item.source}</small><b>{item.value}</b><span>原文：{item.raw}</span></div>) : <span className="unknown">未提供</span>}</div><span className={`fact-status ${row.conflict || row.uncertain ? 'warning' : ''}`}>{row.conflict ? '不一致' : row.uncertain ? '需人工核对' : row.items.length ? '待核对' : '待确认'}</span></div>)}</div></details>}
          <p className="status-line" role="status">{message}</p>
          <div className="actions"><button className="back-button" onClick={() => previous(1)}><ArrowLeft size={15}/> 上一步</button><div className="action-right"><button className="skip-button" onClick={() => goTo(3, true)}>跳过</button><button className="primary-button" onClick={() => goTo(3)}>下一步 <ArrowRight size={16}/></button></div></div>
        </>}

        {step === 3 && !finished && <>
          <div className="card-heading"><div><span className="step-caption">第三步 / 3</span><h2 id="step-heading" tabIndex={-1}>收到货，再核对</h2><p>可展开查看操作步骤；暂时没收到货也可以先跳过。</p></div></div>
          {brandGuide.mismatch && <div className="notice caution">设备类型、品牌或型号可能不匹配，请返回第一步核对；暂使用通用步骤。</div>}
          {!brandGuide.mismatch && brandGuide.label && <p className="hint guide-context">所选设备：{brandGuide.label} / {selection.model.trim() || '型号未填写'}{device === 'phone' ? ` / ${selectedPhoneRegion ? `${selectedPhoneRegion}（待核实）` : '地区版本未确认'}` : ''}。步骤包含品牌通用说明；带型号或系统条件的内容请先核对实机。</p>}
          {device === 'phone' && selection.model.trim() && !brandGuide.label && <div className="notice caution">{selection.model} 的国行销售版本、系统与品牌专属验机入口尚未核实；以下为通用检查，不代表该型号已验证。</div>}
          {result.batteryHazard && <div className="notice caution" role="alert">存在电池损伤线索，请停止使用和充电，暂不进行通电、充电或运行测试，并联系品牌官方或专业维修人员。</div>}
          {conflicts.length > 0 && <div className="notice caution">有 {conflicts.length} 项信息需要核对：{conflicts.map(row => row.label).join('、')}。请查看下方信息对照。</div>}
          <div className="check-progress"><div><h3>核对进度</h3><span>已记录 {recorded} / {checklist[device].length} 项</span></div><progress aria-label="到货核对记录进度" value={recorded} max={checklist[device].length}/></div>
          <div className="check-list">{checklist[device].map((item, index) => {
            const general = checklistDetails[device]?.[item.title] ?? [];
            const guides: { title: string; steps: string[]; source: string; sourceLabel?: string }[] = [...(brandGuide.guides[item.title] ?? []), ...(item.title === '核对型号与存储' ? [regionGuide, regionIdentification, esimGuide].filter(guide => guide !== undefined) : [])];
            return <div className="check-row" key={item.title}><div className="check-number">{String(index + 1).padStart(2, '0')}</div><div className="check-copy"><b>{item.title}</b><p>{result.batteryHazard && (!/外观|机身与配件/.test(item.title) || /开机|充电|通电|运行/.test(item.detail)) ? '存在电池损伤线索，暂不进行通电、充电或运行测试；请联系专业人员。' : item.detail}</p>{!result.batteryHazard && (general.length > 0 || guides.length > 0) && <details className="check-instructions"><summary>查看操作步骤</summary>{general.length > 0 && <ol>{general.map(instruction => <li key={instruction}>{instruction}</li>)}</ol>}{guides.map(guide => <div className="brand-guide" key={guide.title}><strong>{guide.title}</strong><ol>{guide.steps.map(instruction => <li key={instruction}>{instruction}</li>)}</ol><a href={guide.source} target="_blank" rel="noopener noreferrer" aria-label={`${guide.sourceLabel ?? '查看官方说明'}：${guide.title}（新窗口）`}>{guide.sourceLabel ?? '查看官方说明'} ↗</a></div>)}{device === 'phone' && !isApplePhone && selection.model.trim() && ['查看电池与维修记录', '确认账号锁定', '核对保修与维修凭据'].includes(item.title) && <p className="hint">本机销售地区、当前系统版本及该项对所选型号的具体适用性：待核实。</p>}</details>}</div><label><span className="sr-only">{item.title}的检查结果</span><select value={checks[item.title] ?? '未检查'} onChange={e => { const value = e.target.value as CheckState; setChecksByItem(previous => ({ ...previous, [checkKey]: { ...(previous[checkKey] ?? {}), [item.title]: value } })); }}><option>未检查</option><option>一致</option><option>不一致</option><option>不适用</option></select><ChevronDown size={14}/></label></div>;
          })}</div>
          <details className="disclosure optional"><summary>记录实机配置 <span>选填</span><ChevronDown size={15}/></summary><div className="disclosure-body"><label className="field-label" htmlFor="observed">手动输入检查结果</label><textarea className="compact" id="observed" value={observed} onChange={e => setObserved(e.target.value)} placeholder="例如：内存 8GB，存储 512GB" maxLength={12000}/><p className="hint">填写后自动与商品描述对照；系统不会直接读取设备。</p></div></details>
          {conflicts.length > 0 && <details className="disclosure"><summary>查看信息对照 <ChevronDown size={15}/></summary><div className="disclosure-body fact-list">{conflicts.map(row => <div className="fact-row" key={row.key}><span className="fact-label">{row.label}</span><div>{row.items.map((item, index) => <div className="fact-item" key={`${item.source}-${index}`}><small>{item.source}</small><b>{item.value}</b><span>原文：{item.raw}</span></div>)}</div><span className="fact-status warning">{row.uncertain ? '需人工核对' : '不一致'}</span></div>)}</div></details>}
          <p className="hint note">更改品牌、型号、手机地区版本、描述或链接会切换验机记录；改回原信息可找回，刷新页面会清空。请保留交易沟通记录。</p>
          <div className="actions"><button className="back-button" onClick={() => previous(2)}><ArrowLeft size={15}/> 上一步</button><div className="action-right"><button className="skip-button" onClick={() => finish(true)}>暂时跳过</button><button className="primary-button" onClick={() => finish(false)}>完成核对 <Check size={16}/></button></div></div>
        </>}

        {step === 3 && finished && <>
          <div className="finish-icon"><Check size={25}/></div><span className="step-caption">本次记录</span><h2 id="step-heading" tabIndex={-1}>{skipped[3] ? '已暂时跳过到货核对' : '核对记录已整理'}</h2>
          <p className="finish-description">已记录 {recorded} / {checklist[device].length} 项，{checklist[device].length - recorded} 项尚未检查。{conflicts.length ? `有 ${conflicts.length} 项信息需要进一步核对。` : ''}</p>
          <div className="notice">未检查的项目仍是未知；记录仅保留在当前页面，刷新后会清空。</div>
          <div className="actions"><button className="back-button" onClick={() => setFinished(false)}><ArrowLeft size={15}/> 返回核对</button><button className="outline-button" onClick={reset}><RotateCcw size={15}/> 清空重来</button></div>
        </>}
      </section>
      <p className="footer-note">本地文字规则仅供整理参考，不提供真伪鉴定。刷新页面会清空记录。</p>
    </main>
  </>;
}

createRoot(document.getElementById('root')!).render(<App/>);
