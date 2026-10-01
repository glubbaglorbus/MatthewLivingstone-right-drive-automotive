document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    const errors = [];

    if (!form.fullName.value.trim()) errors.push("Full Name required");
    if (!form.email.value.includes('@')) errors.push("Valid Email required");
    if (form.description.value.trim().length < 10) errors.push("Description too short");

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
});
