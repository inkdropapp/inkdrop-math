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

See the [Releases](https://github.com/inkdropapp/inkdrop-math/releases) page for the changelog.
