# České texty e-mailů Supabase Auth

Kam: Supabase → Authentication → Emails (Templates). U každé šablony přepište **Subject** a **Message body** (HTML) podle níže. `{{ .ConfirmationURL }}` nechte přesně takto — Supabase za něj dosadí odkaz.

Platí pro **nový projekt Spolu 8** (ne `spolu-na-prijimacky`). Subdoména `osma.studentbase.cz` je návrh; při jiné ji nahraďte všude níže.

Zároveň: Authentication → URL Configuration
- **Site URL:** `https://osma.studentbase.cz/prehled.html`
- **Redirect URLs** (přidat obě): `https://osma.studentbase.cz/prehled.html`, `https://osma.studentbase.cz/nove-heslo.html`

---

## Confirm signup (potvrzení registrace)

**Subject:** Potvrďte registraci — Spolu 8

```html
<p>Dobrý den,</p>
<p>děkujeme za registraci do <strong>Spolu 8 — opakování 8. třídy</strong>.</p>
<p>Registraci dokončíte kliknutím na tento odkaz:</p>
<p><a href="{{ .ConfirmationURL }}">Potvrdit e-mail a přihlásit se</a></p>
<p>Pak se přihlaste na telefonu (rodič) i na počítači nebo tabletu (dítě) stejným e-mailem a heslem.</p>
<p>Pokud jste se neregistrovali, tento e-mail ignorujte.</p>
<p>Pavel, StudentBase.cz</p>
```

## Reset password (zapomenuté heslo)

**Subject:** Nové heslo — Spolu 8

```html
<p>Dobrý den,</p>
<p>někdo (nejspíš vy) požádal o nové heslo k účtu <strong>Spolu 8</strong>.</p>
<p><a href="{{ .ConfirmationURL }}">Nastavit nové heslo</a></p>
<p>Pokud jste o nové heslo nežádali, e-mail ignorujte — staré heslo platí dál.</p>
<p>Pavel, StudentBase.cz</p>
```

## Change email address (změna e-mailu) — nepovinné

**Subject:** Potvrďte nový e-mail — Spolu 8

```html
<p>Dobrý den,</p>
<p>potvrďte prosím změnu e-mailu k účtu Spolu 8:</p>
<p><a href="{{ .ConfirmationURL }}">Potvrdit nový e-mail</a></p>
<p>Pavel, StudentBase.cz</p>
```

## Poznámka k limitu e-mailů
Vestavěná odesílací služba Supabase má nízký limit (jednotky e-mailů za hodinu). Při zveřejnění s desítkami registrací za hodinu je potřeba vlastní SMTP (Authentication → SMTP Settings — např. e-mailová schránka studentbase.cz nebo služba Resend/Brevo). Viz SPUSTENI.md, krok B6.
