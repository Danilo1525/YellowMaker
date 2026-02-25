import { CompletionContext } from "@codemirror/autocomplete";

// A comprehensive list of common pandas functions, DataFrame methods, and Series methods
const pandasKeywords = [
  // Top-level pandas functions
  {
    label: "pd.read_csv",
    type: "function",
    info: "Read a comma-separated values (csv) file into DataFrame.",
  },
  {
    label: "pd.read_excel",
    type: "function",
    info: "Read an Excel file into a pandas DataFrame.",
  },
  {
    label: "pd.read_json",
    type: "function",
    info: "Convert a JSON string to pandas object.",
  },
  {
    label: "pd.read_sql",
    type: "function",
    info: "Read SQL query or database table into a DataFrame.",
  },
  {
    label: "pd.to_datetime",
    type: "function",
    info: "Convert argument to datetime.",
  },
  {
    label: "pd.to_numeric",
    type: "function",
    info: "Convert argument to a numeric type.",
  },
  {
    label: "pd.concat",
    type: "function",
    info: "Concatenate pandas objects along a particular axis.",
  },
  {
    label: "pd.merge",
    type: "function",
    info: "Merge DataFrame or named Series objects with a database-style join.",
  },
  {
    label: "pd.DataFrame",
    type: "class",
    info: "Two-dimensional, size-mutable, potentially heterogeneous tabular data.",
  },
  {
    label: "pd.Series",
    type: "class",
    info: "One-dimensional ndarray with axis labels.",
  },
  { label: "pd.isna", type: "function", info: "Detect missing values." },
  { label: "pd.notna", type: "function", info: "Detect non-missing values." },
  {
    label: "pd.melt",
    type: "function",
    info: "Unpivot a DataFrame from wide to long format.",
  },
  {
    label: "pd.pivot_table",
    type: "function",
    info: "Create a spreadsheet-style pivot table as a DataFrame.",
  },

  // DataFrame/Series common methods (without pd. prefix)
  { label: "head", type: "method", info: "Return the first n rows." },
  { label: "tail", type: "method", info: "Return the last n rows." },
  {
    label: "info",
    type: "method",
    info: "Print a concise summary of a DataFrame.",
  },
  {
    label: "describe",
    type: "method",
    info: "Generate descriptive statistics.",
  },
  {
    label: "shape",
    type: "property",
    info: "Return a tuple representing the dimensionality of the DataFrame.",
  },
  {
    label: "columns",
    type: "property",
    info: "The column labels of the DataFrame.",
  },
  {
    label: "index",
    type: "property",
    info: "The index (row labels) of the DataFrame.",
  },
  {
    label: "dtypes",
    type: "property",
    info: "Return the dtypes in the DataFrame.",
  },
  { label: "dropna", type: "method", info: "Remove missing values." },
  {
    label: "fillna",
    type: "method",
    info: "Fill NA/NaN values using the specified method.",
  },
  {
    label: "groupby",
    type: "method",
    info: "Group DataFrame using a mapper or by a Series of columns.",
  },
  {
    label: "sort_values",
    type: "method",
    info: "Sort by the values along either axis.",
  },
  {
    label: "sort_index",
    type: "method",
    info: "Sort object by labels (along an axis).",
  },
  {
    label: "reset_index",
    type: "method",
    info: "Reset the index, or a level of it.",
  },
  {
    label: "set_index",
    type: "method",
    info: "Set the DataFrame index using existing columns.",
  },
  { label: "rename", type: "method", info: "Alter axes labels." },
  {
    label: "apply",
    type: "method",
    info: "Apply a function along an axis of the DataFrame.",
  },
  {
    label: "agg",
    type: "method",
    info: "Aggregate using one or more operations over the specified axis.",
  },
  {
    label: "merge",
    type: "method",
    info: "Merge DataFrame or named Series objects with a database-style join.",
  },
  { label: "join", type: "method", info: "Join columns of another DataFrame." },
  {
    label: "value_counts",
    type: "method",
    info: "Return a Series containing counts of unique values.",
  },
  {
    label: "unique",
    type: "method",
    info: "Return unique values of Series object.",
  },
  {
    label: "nunique",
    type: "method",
    info: "Count number of distinct elements in specified axis.",
  },
  {
    label: "isin",
    type: "method",
    info: "Whether each element in the DataFrame is contained in values.",
  },
  {
    label: "copy",
    type: "method",
    info: "Make a copy of this object's indices and data.",
  },
  {
    label: "to_csv",
    type: "method",
    info: "Write object to a comma-separated values (csv) file.",
  },
  {
    label: "to_excel",
    type: "method",
    info: "Write object to an Excel sheet.",
  },
  {
    label: "to_json",
    type: "method",
    info: "Convert the object to a JSON string.",
  },
  {
    label: "to_dict",
    type: "method",
    info: "Convert the DataFrame to a dictionary.",
  },
  { label: "plot", type: "method", info: "Make plots of Series or DataFrame." },
  {
    label: "loc",
    type: "property",
    info: "Access a group of rows and columns by label(s) or a boolean array.",
  },
  {
    label: "iloc",
    type: "property",
    info: "Purely integer-location based indexing for selection by position.",
  },
];

export function pandasAutocomplete(context) {
  // Try to match standard words or words following a dot
  let word = context.matchBefore(/\w*/);
  let dotMatch = context.matchBefore(/\.\w*/);

  // If we are typing immediately after a dot (e.g., df.he)
  if (dotMatch && dotMatch.from < context.pos) {
    // Only suggest methods/properties (remove the 'pd.' specific ones for general object access)
    // Though for pure 'pd.*' we want 'pd.read_csv', etc.
    // We'll let CodeMirror handle the general matching if we just return everything,
    // but we can be smarter.

    // Check if the word before the dot is 'pd'
    let textBeforeDot = context.state.sliceDoc(
      Math.max(0, dotMatch.from - 2),
      dotMatch.from,
    );
    if (textBeforeDot === "pd") {
      // Filter for top-level pd. functions
      const pdOptions = pandasKeywords.filter((k) => k.label.startsWith("pd."));
      return {
        from: dotMatch.from + 1, // Start completion after the dot
        options: pdOptions.map((opt) => ({
          label: opt.label.replace("pd.", ""), // Show just the function name
          type: opt.type,
          info: opt.info,
        })),
        validFor: /^\w*$/,
      };
    } else {
      // Suggest generic dataframe/series methods
      const methodOptions = pandasKeywords.filter(
        (k) => !k.label.startsWith("pd."),
      );
      return {
        from: dotMatch.from + 1,
        options: methodOptions,
        validFor: /^\w*$/,
      };
    }
  }

  // If we are just typing a word (e.g., 'pd' or 're')
  if (word && word.text.length > 0) {
    if (word.text === "pd") {
      return {
        from: word.from,
        options: pandasKeywords
          .filter((k) => k.label.startsWith("pd."))
          .map((opt) => ({
            label: opt.label, // Show the full 'pd.xxx'
            type: opt.type,
            info: opt.info,
          })),
        validFor: /^\w*$/,
      };
    }
  }

  return null;
}
