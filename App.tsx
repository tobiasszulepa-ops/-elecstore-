
import React, { useState } from 'react';
import { Smartphone, ChevronRight, Wrench, Info, CheckCircle, RefreshCcw, ArrowLeft, Send, MessageCircle, AlertTriangle, ShieldAlert, PackageSearch, Share2, ShieldCheck } from 'lucide-react';
import { BRANDS, COMMON_ISSUES } from './constants';
import { QuoteRequest, QuoteResult } from './types';
import { getSmartQuote } from './services/geminiService';

const PHONE_NUMBER = "5491158528983"; // WhatsApp format (Argentina)

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest>({
    brand: '',
    model: '',
    issue: '',
    customDetails: ''
  });
  const [result, setResult] = useState<QuoteResult | null>(null);

  const resetFlow = () => {
    setStep(1);
    setResult(null);
    setQuoteRequest({ brand: '', model: '', issue: '', customDetails: '' });
  };

  const handleNextStep = () => setStep(prev => prev + 1);
  const handleBackStep = () => setStep(prev => Math.max(1, prev - 1));

  const generateQuote = async () => {
    setLoading(true);
    try {
      const data = await getSmartQuote(quoteRequest);
      setResult(data);
      setStep(5);
    } catch (error) {
      console.error("Error generating quote:", error);
      alert("Hubo un error generando tu cotización. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueSelect = (issueLabel: string) => {
    setQuoteRequest({ ...quoteRequest, issue: issueLabel });
    if (issueLabel === 'Otras Reparaciones') {
      setStep(6); 
    } else {
      handleNextStep();
    }
  };

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleConfirmQuote = () => {
    const msg = `Hola ElecStore! Acabo de cotizar en la web el cambio de pantalla para mi ${quoteRequest.brand} ${quoteRequest.model}. El costo estimado fue de ${result?.estimatedPriceRange}. ¿Cómo puedo agendar un turno?`;
    openWhatsApp(msg);
  };

  const handleComplexConsult = () => {
    const msg = `Hola ElecStore! Necesito un diagnóstico avanzado para mi ${quoteRequest.brand} ${quoteRequest.model}. Presenta fallas que no son de pantalla.`;
    openWhatsApp(msg);
  };

  const handleShare = async () => {
    const shareText = `Cotización de pantalla para ${quoteRequest.brand} ${quoteRequest.model} en ElecStore Argentina: ${result?.estimatedPriceRange}.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cotización ElecStore',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
        alert('Cotización copiada al portapapeles');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-gradient-main text-white py-6 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetFlow}>
            <Smartphone className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">ElecStore</h1>
          </div>
          <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">
            Argentina
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Policy Disclaimer Banner */}
        {step < 5 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-blue-800">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-bold">Aviso importante:</span> Solo emitimos cotizaciones automáticas para <span className="font-bold underline">Cambio de Pantalla</span> en ARS. Para otros fallos, contacta a un técnico.
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-8 overflow-hidden bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-main h-full transition-all duration-500" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Step 1: Brand Selection */}
          {step === 1 && (
            <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¿Qué marca es tu dispositivo?</h2>
              <p className="text-slate-500 mb-8">Selecciona la marca para comenzar tu cotización en pesos.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      setQuoteRequest({ ...quoteRequest, brand: brand.name });
                      handleNextStep();
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 hover:shadow-md ${
                      quoteRequest.brand === brand.name 
                        ? 'border-violet-500 bg-violet-50 text-violet-700' 
                        : 'border-slate-100 hover:border-blue-200 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-8 h-8" />
                    <span className="font-semibold">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Model Input */}
          {step === 2 && (
            <div className="p-6 md:p-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={handleBackStep} className="mb-6 flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¿Cuál es el modelo?</h2>
              <p className="text-slate-500 mb-8">Marca: <span className="font-semibold text-blue-600">{quoteRequest.brand}</span></p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ingresa el modelo exacto</label>
                  <input
                    type="text"
                    placeholder="Ej: Samsung S23 Ultra, Moto G200..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                    value={quoteRequest.model}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, model: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && quoteRequest.model && handleNextStep()}
                  />
                </div>
                <button
                  disabled={!quoteRequest.model}
                  onClick={handleNextStep}
                  className="w-full py-4 bg-gradient-main text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  Continuar <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Issue Selection */}
          {step === 3 && (
            <div className="p-6 md:p-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={handleBackStep} className="mb-6 flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¿Qué problema presenta?</h2>
              <p className="text-slate-500 mb-8">Cotizaciones automáticas exclusivas para <span className="font-semibold">pantallas</span>.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMON_ISSUES.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => handleIssueSelect(issue.label)}
                    className={`p-6 rounded-xl border-2 text-left transition-all flex items-start gap-4 hover:shadow-sm ${
                      issue.id === 'screen' 
                        ? 'border-violet-500 bg-violet-50/50' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${issue.id === 'screen' ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {issue.id === 'screen' ? <Wrench className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{issue.label}</h3>
                      <p className="text-sm text-slate-500">{issue.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Final Details & Confirm */}
          {step === 4 && (
            <div className="p-6 md:p-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={handleBackStep} className="mb-6 flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Detalles finales</h2>
              <p className="text-slate-500 mb-8">Describe el estado de la pantalla para ajustar el precio.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Observaciones</label>
                  <textarea
                    placeholder="Ej: Vidrio astillado, manchas líquidas, falla de táctil parcial..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                    value={quoteRequest.customDetails}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, customDetails: e.target.value })}
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-800 italic text-sm">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <p>Al avanzar, aceptas que los precios son estimaciones basadas en mercado real de Argentina.</p>
                </div>

                <button
                  disabled={loading}
                  onClick={generateQuote}
                  className="w-full py-4 bg-gradient-main text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 hover:opacity-90"
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="w-5 h-5 animate-spin" /> Consultando Precios ARS...
                    </>
                  ) : (
                    <>
                      Obtener Cotización Final <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Result / Quote Card */}
          {step === 5 && result && (
            <div className="p-6 md:p-10 animate-in fade-in zoom-in-95 duration-700">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800">Cotización Lista</h2>
                <p className="text-slate-500">Valores estimados en Pesos Argentinos (ARS).</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-violet-50 p-6 rounded-2xl border-2 border-violet-100 relative overflow-hidden">
                    <label className="text-xs font-bold text-violet-600 uppercase tracking-widest block mb-1">Precio Estimado (ARS)</label>
                    <div className="text-3xl sm:text-4xl font-black text-violet-800">{result.estimatedPriceRange}</div>
                    <p className="text-xs text-violet-500 mt-2 font-medium">Basado en referencias reales de mercado.</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                    <label className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Tiempo de Reparación</label>
                    <div className="text-2xl font-bold text-blue-800">{result.estimatedTime}</div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                   <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-500" /> Notas Técnicas
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{result.explanation}</p>
                   </div>

                   {/* CRITICAL RISK DISCLAIMER */}
                   <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 mb-2 text-sm">
                      <AlertTriangle className="w-4 h-4" /> ADVERTENCIA DE RIESGO TÉCNICO
                    </h3>
                    <p className="text-red-600 text-xs leading-relaxed">
                      Debido a la caída, el dispositivo puede tener fallas ocultas. Existe la posibilidad de que el impacto haya causado <strong>microfisuras en la placa base</strong>. Al desarmar el equipo, estas líneas fisuradas pueden terminar de romperse debido a la manipulación técnica necesaria, manifestando fallas que no eran visibles inicialmente. ElecStore no se responsabiliza por daños preexistentes derivados del golpe que se manifiesten durante la reparación.
                    </p>
                   </div>
                </div>
                </div>

                <div className="space-y-6">
                  {/* WARRANTY INFORMATION - Updated with coverage and exclusions */}
                  <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
                    <h3 className="font-bold text-green-800 flex items-center gap-2 mb-3 text-sm uppercase tracking-tight">
                      <ShieldCheck className="w-4 h-4" /> Garantía de Reparación
                    </h3>
                    <div className="space-y-2">
                      <p className="text-green-700 text-xs leading-relaxed">
                        El cambio de pantalla cuenta con una garantía de entre <span className="font-bold">30 y 60 días</span>, según la calidad del repuesto.
                      </p>
                      <p className="text-green-700 text-[11px] leading-tight italic">
                        Cubre exclusivamente <span className="font-semibold underline">fallas de fábrica</span> del módulo.
                      </p>
                      <p className="text-red-700 text-[10px] leading-tight font-medium bg-red-50/50 p-2 rounded-lg border border-red-100">
                        IMPORTANTE: ElecStore no se hará responsable si el equipo presenta signos de <span className="font-bold uppercase">presión excesiva</span>, nuevas <span className="font-bold uppercase">caídas</span> o golpes accidentales posterior a la entrega.
                      </p>
                    </div>
                  </div>

                  {/* PARTS AVAILABILITY DISCLAIMER */}
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-3 text-sm uppercase tracking-tight">
                      <PackageSearch className="w-4 h-4" /> Política de Repuestos
                    </h3>
                    <div className="space-y-3">
                      <p className="text-blue-700 text-xs leading-relaxed">
                        Una vez confirmada la reparación, te avisaremos sobre la existencia del repuesto a conseguir. Existe la posibilidad de que no se consiga el repuesto exacto o, al menos, no con la calidad especificada inicialmente.
                      </p>
                      <p className="text-blue-700 text-xs leading-relaxed font-semibold italic border-l-2 border-blue-300 pl-2">
                        Si deseas realizar la reparación con una calidad inferior o distinta de pantalla, deberás consultarlo personalmente con un asesor de ElecStore.
                      </p>
                    </div>
                  </div>

                  {/* ADDITIONAL RECOMMENDATIONS */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 text-sm mb-3">Recomendaciones adicionales:</h4>
                    <ul className="space-y-2">
                        {result.recommendations.filter((_, i) => i !== 2).map((rec, i) => (
                          <li key={i} className="text-slate-600 text-xs flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleConfirmQuote}
                  className="flex-[2] py-4 bg-gradient-main text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> Confirmar Cita WhatsApp
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> Compartir
                </button>
                <button 
                  onClick={resetFlow}
                  className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Nueva Consulta
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Complex Repairs */}
          {step === 6 && (
            <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Requiere Diagnóstico Avanzado</h2>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                Fallas de placa, carga o daños por agua requieren una revisión física exhaustiva para darte un presupuesto real en Pesos.
              </p>
              
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8 text-left inline-block w-full max-w-md">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2 italic">
                  <ShieldAlert className="w-4 h-4" /> Riesgo por Impacto
                </h3>
                <p className="text-xs text-red-700">
                  Todo dispositivo golpeado puede presentar microfisuras internas en la placa. La manipulación técnica para el diagnóstico puede terminar de comprometer estas líneas de comunicación que ya fueron debilitadas por el golpe original.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleComplexConsult}
                  className="px-10 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> Consultar por WhatsApp
                </button>
                <button 
                  onClick={resetFlow}
                  className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <section className="mt-12 text-center pb-8">
          <p className="text-slate-400 text-sm">© 2024 ElecStore Argentina</p>
          <p className="text-slate-300 text-[10px] mt-4 uppercase tracking-tighter">Precios sujetos a variación cambiaria y revisión técnica presencial</p>
        </section>
      </main>
    </div>
  );
};

export default App;
