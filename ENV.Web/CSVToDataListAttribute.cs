using System;
using System.Web.Mvc;
using Firefly.Box;
using ENV.IO;
using System.Text;
using System.Collections.Generic;

namespace ENV.Web
{
    public class CSVToDataListAttribute : ActionFilterAttribute
    {
        CaptureCSVToDataList _printCapture;
        char _seperator;
        public CSVToDataListAttribute(char seperator = ',')
        {
            _seperator = seperator;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            _printCapture = new CaptureCSVToDataList(_seperator);

            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            DataResult r = _printCapture.GetDataList();
            r.DoResult(filterContext.HttpContext.Response);

            base.OnActionExecuted(filterContext);
        }
        public class CaptureCSVToDataList : ITextWriter
        {
            static ContextStatic<Func<string, System.Text.Encoding, FileWriter, Func<ITextWriter>>> _threadFileWriterFactory = new ContextStatic<Func<string, System.Text.Encoding, FileWriter, Func<ITextWriter>>>();
            static CaptureCSVToDataList()
            {
                var originalFileWriterFactory = ENV.IO.FileWriter._fileWriterFactory;

                ENV.IO.FileWriter._fileWriterFactory = (filename, encoding, fw) =>
                {
                    var currentValue = _threadFileWriterFactory.Value;
                    if (currentValue != null)
                        return currentValue(filename, encoding, fw);
                    return originalFileWriterFactory(filename, encoding, fw);
                };
            }
            System.IO.StringWriter _sw = new System.IO.StringWriter();
            char _seperator;
            public CaptureCSVToDataList(char seperator)
            {
                _seperator = seperator;
                _threadFileWriterFactory.Value = (filename, encoding, fw) => () => this;
            }
            public void Dispose()
            {

            }
            public DataList GetDataList()
            {
                using (var sr = new System.IO.StringReader(_sw.ToString()))
                {
                    var dl = new DataList();
                    SeperatedReader headers = null;
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        var spr = new SeperatedReader(line, _seperator);
                        if (headers == null)
                        {
                            headers = spr;

                        }
                        else
                        {

                            var item = dl.AddItem();
                            for (int i = 0; i < spr.Count; i++)
                            {
                                var x = headers[i];
                                if (string.IsNullOrWhiteSpace(x))
                                    x = "empty" + i;
                                item.Set(x, spr[i]);
                            }
                        }

                    }
                    return dl;
                }
            }

            public void Write(string s)
            {
                _sw.Write(s);
            }

            public void WriteInitBytes(byte[] obj)
            {

            }
        }

    }

    /// <summary>
    /// based on http://doc.fireflymigration.com/export-import-table-data-to-csv-file.html
    /// </summary>
    public class SeperatedReader : IEnumerable<string>
    {
        List<string> _values = new List<string>();
        string _line;
        public SeperatedReader(string line, char seperator = ',')
        {
            _line = line;

            var sr = new System.IO.StringReader(line);
            var sb = new StringBuilder();
            int i = 0;
            bool inQuotes = false;
            while ((i = sr.Read()) != -1)
            {
                if (inQuotes)
                {
                    switch (i)
                    {
                        case '"':
                            if (sr.Peek() == '"')
                            {
                                sb.Append('"');
                                sr.Read();
                            }
                            else
                                inQuotes = false;
                            break;
                        default:
                            sb.Append((char)i);
                            break;
                    }
                }

                else
                    switch (i)
                    {

                        case ',':
                            _values.Add(sb.ToString());
                            sb = new StringBuilder();
                            break;
                        case '"':
                            inQuotes = true;
                            break;
                        default:
                            sb.Append((char)i);
                            break;
                    }
            }
            _values.Add(sb.ToString());
            sb = new StringBuilder();
        }
        public string Line { get { return _line; } }
        public string this[int index]
        {
            get { return _values[index]; }

        }
        public int Count { get { return _values.Count; } }
        public string this[string index]
        {
            get { return _values[ConvertLetter(index)]; }
        }
        static int ConvertLetter(string index)
        {
            int result = 0;
            foreach (var item in index)
            {
                result = result * 26 + (int)item - 'A';
            }
            return result;
        }

        public IEnumerator<string> GetEnumerator()
        {
            return _values.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return _values.GetEnumerator();
        }
    }
    public class SeperatedBuilder
    {
        public static string GetString(params object[] columns)
        {
            var sb = new SeperatedBuilder();

            sb.Add(columns);

            return sb.ToString();
        }

        public SeperatedBuilder(params object[] items)
        {
            Add(items);
        }

        List<object> _cells = new List<object>();
        public void Add(params object[] a)
        {
            _cells.AddRange(a);
        }

        public override string ToString()
        {
            var sb = new StringBuilder();
            bool first = true;
            foreach (var item in _cells)
            {
                if (first)
                    first = false;
                else
                    sb.Append(Seperator);
                var a = item;

                var x = a.ToString();
                if (x.Contains(Seperator.ToString()))
                    x = "\"" +x.Replace("\"", "\"\"") + "\"";
                sb.Append(x);

            }
            return sb.ToString();
        }

        public int Count { get { return _cells.Count; } }

        public object this[int index]
        {
            get { return _cells[index]; }
            set
            {
                var i = index;
                while (_cells.Count <= i)
                    _cells.Add("");
                _cells[i] = value;
            }
        }

        public static int ConvertLetter(string index)
        {
            int result = 0;
            foreach (var item in index)
            {
                result = result * 26 + (int)item - 'A';
            }
            return result;
        }

        public object this[string index]
        {
            get { return this[ConvertLetter(index)]; }
            set { this[ConvertLetter(index)] = value; }
        }

        public char Seperator = ',';
    }
} 
