# math

It adds math syntax support to markdown editor and preview.
It uses [KaTeX](https://katex.org/) to render math typesetting.

## Install

```
ipm install math
```

## Usage

### LaTeX syntax

You can write equations in LaTeX syntax like this:

    ```math
    \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
    ```

or

    $$
    \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
    $$

It will be rendered as:

![block example](https://github.com/inkdropapp/inkdrop-math/raw/master/docs/images/example-01.png)

Inline example:

    Inline math: $\int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}$

It will produce:

![inline example](https://github.com/inkdropapp/inkdrop-math/raw/master/docs/images/example-02.png)

### Equation numbers

You can use `{equation}` to have automatic equation numbers. For example:

    ```math
    \begin{equation}
    2(x+5)-7 = 3(x-2)
    \end{equation}
    ```

    ```math
    \begin{equation}
    2x+10-7 = 3x-6
    \end{equation}
    ```

    ```math
    \begin{equation}
    9 = x
    \end{equation}
    ```

It will produce:

![equation numbers example](https://github.com/inkdropapp/inkdrop-math/raw/master/docs/images/example-03.png)

## Changelog

- 1.5.0
  - Use the bundled math block parser
- 1.4.0
  - Bump up Unified to 11
- 1.3.0
  - Support the new markdown renderer of Inkdrop v5.6.0
- 1.2.1
  - feat(katex): bump up to 0.13.13
  - fix(style): update CSS to the latest (Thanks [Erning](https://github.com/inkdropapp/inkdrop-math/issues/11))
- 1.2.0
  - feat(katex): bump up to 0.13.11
  - Note: Check out [the breaking changes in Katex and migration guide](https://github.com/KaTeX/KaTeX/issues/2490)
- 1.1.2
  - fix(dep): use @matejmazur/react-kate@3.0.2 (Thanks [Matěj](https://forum.inkdrop.app/t/inline-math-doesnt-export-with-pdf-on-linux/2074))
- 1.1.1
  - fix(plugin): unload components and mode for math on deactivation
- 1.1.0
  - feat(katex): update react-katex (Thanks [@tonyonodi](https://github.com/tonyonodi))
  - fix(fonts): Update font face
- 1.0.0
  - Support Inkdrop 4.x
- 0.4.0
  - Bump up katex version
- 0.3.1
  - Remove unused keymaps and menus
- 0.3.0
  - Support Inkdrop v3.4.0
- 0.2.2
  - Support Inkdrop v3.1.1
- 0.2.1
  - Fix font not loaded
- 0.2.0
  - Rename package name
  - Change fence char from 67191\$ to 67191
- 0.1.0 - First release
