/* ========================================
   EXPORT-PDF.JS — Export Progression to PDF
   Uses jsPDF (loaded via CDN in dashboard.html)
   ======================================== */

function exportProgressionPDF() {
  if (typeof window.jspdf === 'undefined') {
    showToast('Erreur: jsPDF non chargé.');
    return;
  }

  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF();

  /* Colors */
  var green = [0, 255, 135];
  var dark = [10, 10, 15];
  var white = [255, 255, 255];
  var muted = [160, 160, 180];

  /* Background */
  doc.setFillColor(dark[0], dark[1], dark[2]);
  doc.rect(0, 0, 210, 297, 'F');

  /* Title */
  doc.setTextColor(green[0], green[1], green[2]);
  doc.setFontSize(22);
  doc.text('Street Workout — Progression', 105, 25, { align: 'center' });

  doc.setDrawColor(green[0], green[1], green[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  var y = 45;

  /* User info */
  var formData = SW.load('formData') || {};
  var profileName = SW.load('profileName') || 'Athlète';

  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFontSize(14);
  doc.text('Profil: ' + profileName, 20, y);
  y += 8;
  doc.text('Date: ' + new Date().toLocaleDateString('fr-FR'), 20, y);
  y += 12;

  /* Stats */
  doc.setTextColor(green[0], green[1], green[2]);
  doc.setFontSize(16);
  doc.text('Performances', 20, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(white[0], white[1], white[2]);

  var stats = [
    { label: 'Poids', value: (formData.weight || '—') + ' kg' },
    { label: 'Tractions max', value: (formData.pullups || '0') + ' reps' },
    { label: 'Dips max', value: (formData.dips || '0') + ' reps' },
    { label: 'Pompes max', value: (formData.pushups || '0') + ' reps' },
    { label: 'Squats max', value: (formData.squats || '0') + ' reps' },
    { label: 'Muscle-up', value: (formData.muscleup === 'oui') ? 'Oui ✓' : 'Non' }
  ];

  stats.forEach(function(s) {
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.text(s.label + ':', 25, y);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text(s.value, 80, y);
    y += 7;
  });

  y += 5;

  /* Level */
  var data = {
    pullups: parseInt(formData.pullups) || 0,
    dips: parseInt(formData.dips) || 0,
    pushups: parseInt(formData.pushups) || 0,
    squats: parseInt(formData.squats) || 0,
    muscleup: formData.muscleup || 'non'
  };
  var level = calculateLevel(data);

  doc.setTextColor(green[0], green[1], green[2]);
  doc.setFontSize(16);
  doc.text('Niveau', 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(level.icon + ' ' + level.level + ' — Score: ' + level.score + '/100', 25, y);
  y += 15;

  /* Progression steps (from localStorage) */
  var progressKeys = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key && key.indexOf('sw_progress_') === 0) {
      progressKeys.push(key);
    }
  }

  if (progressKeys.length > 0) {
    doc.setTextColor(green[0], green[1], green[2]);
    doc.setFontSize(16);
    doc.text('Progression des exercices', 20, y);
    y += 10;

    doc.setFontSize(10);
    progressKeys.sort();

    progressKeys.forEach(function(key) {
      if (y > 270) {
        doc.addPage();
        doc.setFillColor(dark[0], dark[1], dark[2]);
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }

      var exName = key.replace('sw_progress_', '').replace(/_/g, ' ');
      var val = '';
      try { val = JSON.parse(localStorage.getItem(key)); } catch(e) { val = localStorage.getItem(key); }

      doc.setTextColor(muted[0], muted[1], muted[2]);
      doc.text(exName + ': ', 25, y);
      doc.setTextColor(white[0], white[1], white[2]);
      doc.text(String(val), 80, y);
      y += 6;
    });

    y += 10;
  }

  /* Last 3 sessions */
  var sessions = SW.load('sessions') || [];
  var last3 = sessions.slice(-3).reverse();

  if (last3.length > 0) {
    if (y > 240) {
      doc.addPage();
      doc.setFillColor(dark[0], dark[1], dark[2]);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }

    doc.setTextColor(green[0], green[1], green[2]);
    doc.setFontSize(16);
    doc.text('Dernières séances', 20, y);
    y += 10;

    doc.setFontSize(10);

    last3.forEach(function(s) {
      if (y > 275) {
        doc.addPage();
        doc.setFillColor(dark[0], dark[1], dark[2]);
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }

      var d = new Date(s.date);
      var dateStr = d.toLocaleDateString('fr-FR');

      doc.setTextColor(white[0], white[1], white[2]);
      doc.text(dateStr + ' — ' + (s.type || '—'), 25, y);
      y += 6;
      doc.setTextColor(muted[0], muted[1], muted[2]);
      doc.text('Exercices: ' + (s.exercicesFaits || '—') + '  |  Séries: ' + (s.seriesFaites || '—') + '  |  Complétion: ' + (s.completion || 0) + '%', 30, y);
      y += 8;
    });
  }

  /* Footer */
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.setFontSize(8);
  doc.text('Généré par Street Workout App — ' + new Date().toLocaleString('fr-FR'), 105, 290, { align: 'center' });

  /* Save */
  doc.save('streetworkout-progression.pdf');
  showToast('PDF exporté avec succès ! 📄');
}
