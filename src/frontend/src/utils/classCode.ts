export function getOrCreateClassCode(): string {
  let code = localStorage.getItem("mathspark_class_code");
  if (!code) {
    code = Math.random().toString(36).toUpperCase().slice(2, 8);
    localStorage.setItem("mathspark_class_code", code);
  }
  return code;
}
