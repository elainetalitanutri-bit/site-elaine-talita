(function () {
  'use strict';
  const path = location.pathname.replace(/\/$/, '');
  const page = path.endsWith('/bio') ? 'link_bio' : path.endsWith('/masterclass') ? 'masterclass' : path.endsWith('/membros') ? 'area_membros' : 'site_principal';
  const params = new URLSearchParams(location.search);
  const campaign = {
    page_name: page,
    utm_source: params.get('utm_source') || 'direto',
    utm_medium: params.get('utm_medium') || 'nao_informado',
    utm_campaign: params.get('utm_campaign') || 'nao_informado',
    utm_content: params.get('utm_content') || 'nao_informado'
  };

  window.elaineTrack = function (googleEvent, details, metaEvent) {
    const data = Object.assign({}, campaign, details || {});
    if (typeof window.gtag === 'function') window.gtag('event', googleEvent, data);
    if (typeof window.fbq === 'function') {
      if (metaEvent && ['Contact', 'Lead', 'CompleteRegistration', 'ViewContent'].includes(metaEvent)) window.fbq('track', metaEvent, data);
      else window.fbq('trackCustom', metaEvent || googleEvent, data);
    }
  };

  if (page === 'masterclass' || page === 'link_bio') window.elaineTrack('view_content', {}, 'ViewContent');

  document.addEventListener('click', function (event) {
    const element = event.target.closest('a,button');
    if (!element) return;
    const href = element.getAttribute('href') || '';
    const label = (element.textContent || element.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const lower = (href + ' ' + label).toLowerCase();

    if (/wa\.me|whatsapp/.test(lower)) window.elaineTrack('click_whatsapp', { button_label: label }, 'Contact');
    if (/instagram\.com/.test(lower)) window.elaineTrack('click_instagram', { button_label: label }, 'SocialClick');
    if (/^mailto:/.test(href)) window.elaineTrack('click_email', { button_label: label }, 'Contact');
    if (/^tel:/.test(href)) window.elaineTrack('click_phone', { button_label: label }, 'Contact');
    if (/membros/.test(href)) window.elaineTrack('click_members_area', { button_label: label }, 'MembersAreaClick');
    if (/mapa da sa[uú]de|protocolo ns|plano de acompanhamento|suporte em grupo/.test(lower)) window.elaineTrack('select_service', { service_label: label }, 'ViewContent');
    if (/começar diagn[oó]stico/.test(lower)) window.elaineTrack('diagnostic_start', {}, 'DiagnosticStart');
    if (page === 'masterclass' && (href === '#inscricao' || element.id === 'submitButton')) window.elaineTrack('masterclass_cta_click', { button_label: label }, 'MasterclassCTAClick');
  }, { passive: true });

  let formStarted = false;
  document.addEventListener('focusin', function (event) {
    if (!formStarted && event.target.closest('#leadForm')) {
      formStarted = true;
      window.elaineTrack('form_start', { form_name: 'masterclass' }, 'MasterclassFormStart');
    }
  });
})();
