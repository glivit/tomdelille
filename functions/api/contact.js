// Cloudflare Pages Function — contact form handler
// Forwards form submissions to Web3Forms which emails delille.tom@gmail.com.
// Required env var (Cloudflare Pages → Settings → Environment variables):
//   WEB3FORMS_KEY — access key from https://web3forms.com (free tier)

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.formData();
    const naam     = (data.get('naam') || '').toString().trim();
    const telefoon = (data.get('telefoon') || '').toString().trim();
    const email    = (data.get('email') || '').toString().trim();
    const bericht  = (data.get('bericht') || '').toString().trim();

    if (!naam || !telefoon) {
      return Response.json(
        { ok: false, error: 'Naam en telefoon zijn verplicht.' },
        { status: 400 }
      );
    }

    const key = env.WEB3FORMS_KEY;
    if (!key) {
      return Response.json(
        { ok: false, error: 'Server is niet geconfigureerd.' },
        { status: 500 }
      );
    }

    const body = new FormData();
    body.append('access_key', key);
    body.append('subject', `Nieuwe afspraakaanvraag — ${naam}`);
    body.append('from_name', 'Tom De Lille · website');
    body.append('replyto', email || 'noreply@tomdelille.be');
    body.append('Naam', naam);
    body.append('Telefoon', telefoon);
    body.append('E-mail', email);
    body.append('Bericht', bericht || '(geen bericht)');
    // Honeypot — Web3Forms will silently drop if this field is filled
    body.append('botcheck', '');

    const w3 = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body,
    });

    if (!w3.ok) {
      return Response.json(
        { ok: false, error: 'De verzending is mislukt.' },
        { status: 502 }
      );
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    );
  }
}
