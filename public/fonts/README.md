# Licensed Font Files

Place the licensed Didot font file here:

```txt
public/fonts/Didot.otf
```

The header logo is already configured in `app/globals.css` to load that file through:

```css
@font-face {
  font-family: "Sylvaine Didot";
  src: url("/fonts/Didot.otf") format("opentype");
}
```

Do not commit or distribute a commercial font file unless the license allows it.
