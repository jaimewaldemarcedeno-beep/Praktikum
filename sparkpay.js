// Benutzer-Klasse (wie deine Java-Klasse)
class Benutzer {
  constructor(name, passwort) {
    this.Name = name;
    this.Passwort = passwort;
    this.KontoA = 0.0;
    this.KontoB = 0.0;
    this.translog = "";
  }
}

// Globale Variablen (ArrayLists aus Java werden hier zu Arrays)
let benutzerListe = [];
let aktuellerUser = null;
let fehlversuche = 3;

// --- REGISTRIERUNG & LOGIN ---

function registrieren() {
  const name = document.getElementById("reg-name").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();
  const msg = document.getElementById("auth-message");

  if (!name || !pass) {
    msg.innerText = "Bitte Name und Passwort eingeben.";
    return;
  }

  // Prüfen, ob Name bereits existiert
  if (benutzerListe.some(u => u.Name === name)) {
    msg.innerText = "Benutzername existiert bereits!";
    return;
  }

  const neuerUser = new Benutzer(name, pass);
  benutzerListe.push(neuerUser);
  
  msg.innerText = `Willkommen ${name}! Du kannst dich jetzt anmelden.`;
  document.getElementById("reg-name").value = "";
  document.getElementById("reg-pass").value = "";
}

function anmelden() {
  const name = document.getElementById("login-name").value.trim();
  const pass = document.getElementById("login-pass").value.trim();
  const msg = document.getElementById("auth-message");

  const gefundenerUser = benutzerListe.find(u => u.Name === name && u.Passwort === pass);

  if (gefundenerUser) {
    aktuellerUser = gefundenerUser;
    fehlversuche = 3;
    msg.innerText = "";
    
    // Login-Fenster ausblenden, Dashboard anzeigen
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    
    updateDashboard();
  } else {
    fehlversuche--;
    if (fehlversuche <= 0) {
      msg.innerText = "Zu viele Fehlversuche. Seite bitte neu laden.";
      document.querySelectorAll("#auth-section input, #auth-section button").forEach(el => el.disabled = true);
    } else {
      msg.innerText = `Falscher Name oder Passwort! Noch ${fehlversuche} Versuche.`;
    }
  }
}

function abmelden() {
  aktuellerUser = null;
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");
  document.getElementById("login-name").value = "";
  document.getElementById("login-pass").value = "";
}

// --- DASHBOARD UND BANKING-LOGIK ---

function updateDashboard() {
  if (!aktuellerUser) return;

  // Header & Kontostände aktualisieren
  document.getElementById("user-display-name").innerText = aktuellerUser.Name;
  document.getElementById("balance-a").innerText = aktuellerUser.KontoA.toFixed(2);
  document.getElementById("balance-b").innerText = aktuellerUser.KontoB.toFixed(2);
  
  // Transaktionslog
  document.getElementById("translog-view").value = aktuellerUser.translog || "Noch keine Transaktionen vorhanden.";

  // Empfänger-Auswahlliste füllen (alle User außer dem eingeloggten)
  const targetSelect = document.getElementById("transfer-target-user");
  targetSelect.innerHTML = "";
  benutzerListe.forEach(u => {
    if (u.Name !== aktuellerUser.Name) {
      const opt = document.createElement("option");
      opt.value = u.Name;
      opt.innerText = u.Name;
      targetSelect.appendChild(opt);
    }
  });
}

function einzahlen() {
  const konto = document.getElementById("action-konto").value;
  const betrag = parseFloat(document.getElementById("action-amount").value);
  const msg = document.getElementById("dashboard-message");

  if (isNaN(betrag) || betrag <= 0) {
    msg.innerText = "Ungültige Eingabe beim Einzahlen.";
    return;
  }

  aktuellerUser[konto] += betrag;
  aktuellerUser.translog += `Geld auf ${konto} eingezahlt: ${betrag.toFixed(2)}€\n`;
  
  msg.innerText = "Einzahlung erfolgreich!";
  document.getElementById("action-amount").value = "";
  updateDashboard();
}

function abheben() {
  const konto = document.getElementById("action-konto").value;
  const betrag = parseFloat(document.getElementById("action-amount").value);
  const msg = document.getElementById("dashboard-message");

  if (isNaN(betrag) || betrag <= 0) {
    msg.innerText = "Ungültige Eingabe beim Abheben.";
    return;
  }

  // Java-Regel: Konto darf nicht unter -500€ fallen
  if (betrag <= aktuellerUser[konto] + 500) {
    aktuellerUser[konto] -= betrag;
    aktuellerUser.translog += `Von ${konto} ${betrag.toFixed(2)}€ abgehoben\n`;
    msg.innerText = "Abhebung erfolgreich!";
    document.getElementById("action-amount").value = "";
  } else {
    msg.innerText = "Fehler: Nicht genügend Guthaben (Limit -500€ erreicht).";
  }

  updateDashboard();
}

function ueberweisen() {
  const vonKonto = document.getElementById("transfer-from").value;
  const empfaengerName = document.getElementById("transfer-target-user").value;
  const zielKonto = document.getElementById("transfer-to").value;
  const betrag = parseFloat(document.getElementById("transfer-amount").value);
  const msg = document.getElementById("dashboard-message");

  if (!empfaengerName) {
    msg.innerText = "Kein Empfänger ausgewählt (mindestens 2 registrierte Konten erforderlich).";
    return;
  }

  if (isNaN(betrag) || betrag <= 0) {
    msg.innerText = "Ungültiger Überweisungsbetrag.";
    return;
  }

  const empfaenger = benutzerListe.find(u => u.Name === empfaengerName);

  // Java-Regel: Überweisung inkl. 0.50€ Gebühr bis Limit -500€
  if (betrag <= aktuellerUser[vonKonto] + 499.5) {
    empfaenger[zielKonto] += betrag;
    aktuellerUser[vonKonto] -= (betrag + 0.5); // 0,50€ Überweisungsgebühr
    
    aktuellerUser.translog += `Von ${vonKonto} an ${empfaenger.Name} (${zielKonto}) ${betrag.toFixed(2)}€ überweisen (0.50€ Gebühr)\n`;
    msg.innerText = `Überweisung erfolgreich an ${empfaenger.Name}!`;
    document.getElementById("transfer-amount").value = "";
  } else {
    msg.innerText = "Fehler: Nicht ausreichend Guthaben für Überweisung + Gebühr.";
  }

  updateDashboard();
}