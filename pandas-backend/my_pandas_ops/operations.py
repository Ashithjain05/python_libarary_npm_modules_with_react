import pandas as pd
import numpy as np

AGG_RETURNS_SCALAR = {
    "mean",
    "median",
    "std",
    "var",
}

def run_operation(numbers, operation, **kwargs):
    s = pd.Series(numbers)

    if operation == "add_scalar":
        k = kwargs.get("k", 0)
        out = s + k
    elif operation == "subtract_scalar":
        k = kwargs.get("k", 0)
        out = s - k
    elif operation == "multiply_scalar":
        k = kwargs.get("k", 1)
        out = s * k
    elif operation == "divide_scalar":
        k = kwargs.get("k", 1)
        out = s / k
    elif operation == "power_scalar":
        k = kwargs.get("k", 2)
        out = s ** k
    elif operation == "square":
        out = s ** 2
    elif operation == "sqrt":
        out = np.sqrt(s)
    elif operation == "log":
        out = np.log(s)
    elif operation == "exp":
        out = np.exp(s)
    elif operation == "sin":
        out = np.sin(s)
    elif operation == "cos":
        out = np.cos(s)
    elif operation == "tan":
        out = np.tan(s)
    elif operation == "mean":
        return float(s.mean())
    elif operation == "median":
        return float(s.median())
    elif operation == "std":
        return float(s.std(ddof=0))
    elif operation == "var":
        return float(s.var(ddof=0))
    elif operation == "cumsum":
        out = s.cumsum()
    elif operation == "zscore":
        mu, sigma = s.mean(), s.std(ddof=0)
        out = (s - mu) / (sigma if sigma != 0 else 1)
    elif operation == "minmax_scale":
        mn, mx = s.min(), s.max()
        denom = (mx - mn) if mx != mn else 1
        out = (s - mn) / denom
    elif operation == "pct_change":
        out = s.pct_change().fillna(0)
    else:
        raise ValueError("Unsupported operation")

    if operation in AGG_RETURNS_SCALAR:
        # already returned above
        pass

    return out.tolist()
