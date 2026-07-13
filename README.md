# ממיר קואורדינטות בסיסי

גרסת MVP להמרת נקודה בודדת בין:

- WGS 84 — EPSG:4326
- ITM — EPSG:2039
- UTM Zone 36N — EPSG:32636

## העלאה ל-GitHub Pages

1. היכנסו ל-GitHub.
2. צרו Repository חדש בשם `coordinate-converter`.
3. בחרו Public.
4. העלו לשורש ה-Repository את שלושת הקבצים:
   - `index.html`
   - `style.css`
   - `app.js`
5. פתחו Settings של ה-Repository.
6. בתפריט השמאלי בחרו Pages.
7. תחת Build and deployment:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /(root)
8. לחצו Save.
9. לאחר הפרסום כתובת האתר תהיה בדרך כלל:
   `https://USERNAME.github.io/coordinate-converter/`

## הטמעה ב-WordPress

בבלוק HTML מותאם אישית ניתן לנסות:

```html
<iframe
  src="https://USERNAME.github.io/coordinate-converter/"
  width="100%"
  height="760"
  style="border:0"
  loading="lazy"
  title="ממיר קואורדינטות">
</iframe>
```

יש להחליף `USERNAME` בשם המשתמש שלכם ב-GitHub.

אם WordPress מסיר את תגית iframe, השתמשו בבלוק Embed/הטמעה או בקישור רגיל לכלי.
