using ENV.Printing;
using Firefly.Box;
using Firefly.Box.Data.Advanced;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;
using System.Collections;
using ENV.Utilities;
using Newtonsoft.Json.Linq;

namespace ENV.Web
{
    public class DataItem : ISerializedObject
    {
        List<Val> _value = new List<Val>();
        Dictionary<string, Val> _vals = new Dictionary<string, Val>();
        public string ObjectType = "Object";
        public void Set(params ColumnBase[] cols)
        {
            Set((IEnumerable<ColumnBase>)cols);
        }
        public bool ContainsKey(string key)
        {
            return _vals.ContainsKey(key);
        }
        public string[] Keys { get { return _vals.Keys.ToArray<string>(); } }
        public void Set(IEnumerable<ColumnBase> cols)
        {
            foreach (var c in cols)
            {
                Set(c.Name, c.Value);
            }

        }
        public void Set(string name, object value)
        {
            value = FixValueTypes(value);

            Val result;
            if (_vals.TryGetValue(name, out result))
            {
                result.Value = value;
            }
            else
            {
                result = new Val { Name = name, Value = value };
                _value.Add(result);
                _vals.Add(name, result);
            }



        }

        internal static object FixValueTypes(object value)
        {
            if (value == null)
                return null;
            Text txt;
            Number n;
            Date d;
            Time t;
            Bool b;
            if (Text.TryCast(value, out txt))
            {

                value = (txt ?? "").TrimEnd().ToString();
            }
            else if (Number.TryCast(value, out n))
            {
                var dec = n.ToDecimal();
                var lng = (long)dec;
                if (dec != lng)
                    value = dec;
                else value = lng;

            }
            else if (Date.TryCast(value, out d))
            {
                if (d == Date.Empty)
                    value = null;
                else
                {
                    value = d.ToString("YYYY-MM-DD");
                }
            }
            else if (Time.TryCast(value, out t))
            {
                value = t.ToString("HH:MM:SS");
            }
            else if (Bool.TryCast(value, out b))
                value = b.ToBoolean();
            return value;
        }

        public string ToJson()
        {
            using (var sw = new StringWriter())
            {
                ToWriter(new JsonISerializedObjectWriter(sw));
                return sw.ToString();
            }
        }
        public static DataItem FromJson(string s)
        {
            if (string.IsNullOrEmpty(s))
                throw new InvalidOperationException("Empty JSON Content - did you forget settings the ContentType:application/json");
            var di = new DataItem();
            foreach (var pair in JObject.Parse(s))
            {
                object value = pair.Value.ToObject<object>();
                if (value is JArray)
                    value = DataList.FromJson(value.ToString());
                else if (value != null)
                    value = value.ToString();
                di.Set(pair.Key, value);
            }

            return di;
        }
        class Val
        {
            public string Name { get; set; }
            public object Value { get; set; }
        }


        public void ToWriter(ISerializedObjectWriter writer)
        {
            writer.WriteStartObject(ObjectType);
            foreach (var item in _value)
            {
                writer.WriteName(item.Name);
                var v = item.Value as ISerializedObject;
                if (v != null)
                    writer.WriteIserializedObject(v);
                else
                    writer.WriteValue(item.Value);
            }
            writer.WriteEndObject();
        }
        internal DataList GetList(object name)
        {
            return (DataList)Get(name);
        }
        internal object Get(object name)
        {

            foreach (var item in _value)
            {
                if (item.Name == (string)name)
                    return item.Value;
            }
            return null;
        }
        public DataItemValue this[string key]
        {
            get
            {
                return new DataItemValue(Get(key));
            }
        }
    }
    public class DataItemValue
    {
        object _o;
        public DataItemValue(object o)
        {
            _o = o;
        }

        public Number Number
        {

            get
            {
                Number r;
                if (Number.TryCast(_o, out r))
                    return r;
                return Number.Parse(_o.ToString());
            }
        }

        public Text Text
        {
            get
            {
                if (_o == null)
                    return null;
                return _o.ToString();
            }
        }
        public Date Date
        {
            get
            {
                Date r;
                if (Date.TryCast(_o, out r))
                    return r;
                return Date.Parse(_o.ToString(), ("YYYY-MM-DD"));
            }
        }
        public Time Time
        {
            get
            {
                Time r;
                if (Time.TryCast(_o, out r))
                    return r;
                if (_o == null)
                    return null;
                return Time.Parse(_o.ToString(), ("HH:MM:SS"));
            }
        }
        public Bool Bool
        {
            get
            {
                Bool r;
                if (Bool.TryCast(_o, out r))
                    return r;
                return _o.ToString().ToLower() == "true";
            }
        }
        public DataList DataList
        {
            get
            {
                return _o as DataList;
            }
        }
        public DataItem DataItem
        {
            get
            {
                return _o as DataItem;
            }
        }

        internal T GetValue<T>()
        {
            if (typeof(T) == typeof(Text))
                return (T)(object)this.Text;
            if (typeof(T) == typeof(Number))
                return (T)(object)this.Number;
            if (typeof(T) == typeof(Date))
                return (T)(object)this.Date;
            if (typeof(T) == typeof(Time))
                return (T)(object)this.Time;
            if (typeof(T) == typeof(Bool))
                return (T)(object)this.Bool;
            throw new Exception("Unknown stuff");
        }
    }
    public interface ISerializedObject
    {
        void ToWriter(ISerializedObjectWriter writer);
    }
    public interface ISerializedObjectWriter : IDisposable
    {
        void WriteStartArray();
        void WriteName(string name);
        void WriteValue(object value);
        void WriteIserializedObject(ISerializedObject value);
        void WriteEndArray();
        void WriteStartObject(string type);
        void WriteEndObject();

    }
    public class XmlISerializedObjectWriter : ISerializedObjectWriter
    {
        XmlTextWriter _writer;
        public XmlISerializedObjectWriter(XmlTextWriter writer)
        {
            _writer = writer;
            WriteStartObject("root");
        }

        public void Dispose()
        {
            WriteEndObject();
        }

        public void WriteEndArray()
        {

        }

        public void WriteEndObject()
        {
            _writer.WriteEndElement();
        }

        public void WriteIserializedObject(ISerializedObject value)
        {
            value.ToWriter(this);
            _writer.WriteEndElement();
        }

        public void WriteName(string name)
        {
            _writer.WriteStartElement(name);
        }

        public void WriteStartArray()
        {
        }

        public void WriteStartObject(string type)
        {
            _writer.WriteStartElement(type);
        }

        public void WriteValue(object value)
        {
            if (value == null)
                value = "";
            _writer.WriteString(value.ToString());
            _writer.WriteEndElement();
        }
    }
    public class JsonISerializedObjectWriter : ISerializedObjectWriter
    {
        TextWriter _writer;
        public JsonISerializedObjectWriter(TextWriter writer)
        {
            _writer = writer;
        }
        public void WriteEndArray()
        {
            _writer.Write("]");
        }

        public void WriteEndObject()
        {
            _writer.Write("}");
        }
        bool _firstObjectInArray = true;
        bool _firstValueInObject = true;
        public void WriteIserializedObject(ISerializedObject value)
        {
            value.ToWriter(new JsonISerializedObjectWriter(_writer));
        }

        public void WriteName(string name)
        {
            if (_firstValueInObject)
                _firstValueInObject = false;
            else
                _writer.Write(",");
            _writer.Write("\"" + name.Replace("\"", "\\\"") + "\":");
        }

        public void WriteStartArray()
        {
            _writer.Write("[");
            _firstObjectInArray = true;
        }

        public void WriteStartObject(string type)
        {
            _firstValueInObject = true;
            if (_firstObjectInArray)
                _firstObjectInArray = false;
            else
                _writer.Write(",");
            _writer.Write("{");
        }

        public void WriteValue(object value)
        {
            if (value == null)
                _writer.Write("null");
            else if (value is int || value is long)

                _writer.Write(value.ToString());
            else if (value is double)
            {
                _writer.Write(((double)value).ToString(System.Globalization.CultureInfo.InvariantCulture));
            }
            else if (value is decimal)
            {
                _writer.Write(((decimal)value).ToString(System.Globalization.CultureInfo.InvariantCulture));
            }
            else if (value is bool)
                _writer.Write(value.ToString().ToLower());
            else if (value is string[])
            {
                WriteStartArray();
                int i = 0;
                foreach (var item in (string[])value)
                {
                    if (i++ > 0)
                        _writer.Write(", ");
                    WriteValue(item);
                }
                WriteEndArray();
            }
            else
                _writer.Write("\"" + value.ToString().Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\t", "\\t") + "\"");
        }

        public void Dispose()
        {

        }
    }


    public class CSVISerializedObjectWriter : ISerializedObjectWriter
    {
        TextWriter _writer;
        public CSVISerializedObjectWriter(TextWriter writer)
        {
            _writer = writer;
        }
        public void WriteEndArray()
        {

        }

        public void WriteEndObject()
        {
            if (_firstLine)
            {
                _writer.WriteLine(_titleLine);
                _firstLine = false;
            }
            _writer.WriteLine(_dataLine);
        }
        public void WriteIserializedObject(ISerializedObject value)
        {
            if (!_inValue)
                value.ToWriter(this);
            else
            {
                using (var sw = new StringWriter())
                {
                    value.ToWriter(new CSVISerializedObjectWriter(sw));
                    WriteValue(sw.ToString());
                }
            }
            //value.ToWriter(new CSVISerializedObjectWriter(_writer));
        }
        bool _firstLine = true;

        string _titleLine = "";
        string _dataLine = "";
        bool _inValue = false;
        public void WriteName(string name)
        {
            if (_firstLine)
            {
                if (_titleLine.Length > 0)
                    _titleLine += ",";
                _titleLine += name;
            }
            _inValue = true;
        }

        public void WriteStartArray()
        {
        }

        public void WriteStartObject(string type)
        {
            _dataLine = "";
        }

        public void WriteValue(object value)
        {
            if (_dataLine.Length > 0)
                _dataLine += ",";
            if (value == null)
                value = "";
            var val = value.ToString();
            if (val.Contains(",") || val.Contains("\r\n"))
                val = "\"" + val.ToString().Replace("\"", "\"\"") + "\"";
            _dataLine += val;
            _inValue = false;
        }

        public void Dispose()
        {

        }
    }
    public class HTMLISerializedObjectWriter : ISerializedObjectWriter
    {
        internal static string HTMLPageHeader = @"
<!DOCTYPE html>
<html lang=""en"">
<head>
     <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
<style>" + StoredStuff.BootstrapCss + @"
</style>
     
</head>
<body>";

        TextWriter _writer;
        public HTMLISerializedObjectWriter(TextWriter writer, string title = null, bool root = true)
        {

            _writer = writer;
            if (root)
            {
                _writer.WriteLine(HTMLPageHeader);
                if (!string.IsNullOrEmpty(title))
                    _writer.WriteLine("<h1>" + title + "</h1>");
            }
        }
        bool _inArray = false;
        public void WriteEndArray()
        {
            _writer.WriteLine(" </table>");
        }

        public void WriteEndObject()
        {
            if (!_inArray)
                WriteTableStart();
            if (_firstLine)
            {
                _writer.WriteLine("<tr>" + _titleLine + "</tr");
                _firstLine = false;
            }
            _writer.WriteLine("<tr>" + _dataLine + "</tr>");
            if (!_inArray)
                _writer.WriteLine("</table>");
        }
        public void WriteIserializedObject(ISerializedObject value)
        {
            if (!_inValue)
                value.ToWriter(this);
            else
            {
                using (var sw = new StringWriter())
                {
                    value.ToWriter(new HTMLISerializedObjectWriter(sw));
                    WriteValue(sw.ToString());
                }
            }
            //value.ToWriter(new CSVISerializedObjectWriter(_writer));
        }
        bool _firstLine = true;

        string _titleLine = "";
        string _dataLine = "";
        bool _inValue = false;
        public void WriteName(string name)
        {
            if (_firstLine)
            {

                _titleLine += "<th>" + name + "</th>";
            }
            _inValue = true;
        }

        public void WriteStartArray()
        {
            _inArray = true;
            WriteTableStart();
        }

        private void WriteTableStart()
        {
            _writer.WriteLine(@"<table class=""table table-responsive table-striped table-bordered table-hover table-condensed table-responsive"">");
        }

        public void WriteStartObject(string type)
        {
            _dataLine = "";
        }

        public void WriteValue(object value)
        {
            if (value == null)
                value = "";
            var val = value.ToString();

            _dataLine += "<td>" + val + "</td>";
            _inValue = false;
        }
        public string BodyAddition = null;
        public void Dispose()
        {
            if (!string.IsNullOrEmpty(BodyAddition))
                _writer.WriteLine(BodyAddition);
            _writer.WriteLine(@"</body>
    <script >" + StoredStuff.JQuery + @"</script>
    <script >" + StoredStuff.BootstrapJs + @"</script>
</html>");
        }
    }
    public class DataList : ISerializedObject, IEnumerable<DataItem>
    {
        List<DataItem> _list = new List<DataItem>();
        public DataItem AddItem(IEnumerable<ColumnBase> columns)
        {
            var r = new DataItem();
            r.Set(columns);
            _list.Add(r);
            return r;
        }
        public void AddItem(DataItem item)
        {
            _list.Add(item);
        }
        public DataItem AddItem(ENV.Data.Entity e)
        {
            return AddItem(e.Columns);
        }
        public DataItem AddItem(params ColumnBase[] columns)
        {
            return AddItem((IEnumerable<ColumnBase>)columns);
        }

        public string ToJson()
        {
            using (var sw = new StringWriter())
            {
                ToWriter(new JsonISerializedObjectWriter(sw));
                return sw.ToString();
            }
        }
        public static DataList FromJson(string s)
        {
            var result = new DataList();

            var jArr = JArray.Parse(s);
            foreach (var jObj in jArr.Children<JObject>())
            {
                var di = DataItem.FromJson(jObj.ToString());
                result.AddItem(di);
            }

            return result;
        }


        public void ToWriter(ISerializedObjectWriter writer)
        {
            writer.WriteStartArray();
            foreach (var item in _list)
            {
                item.ToWriter(writer);
            }
            writer.WriteEndArray();
        }

        public string ToXml()
        {
            using (var sw = new StringWriter())
            {
                ToWriter(new XmlISerializedObjectWriter(new XmlTextWriter(sw)));
                return sw.ToString();
            }
        }
        public string ToCsv()
        {

            using (var sw = new StringWriter())
            {
                ToWriter(new CSVISerializedObjectWriter(sw));
                return sw.ToString();
            }
        }
        public string ToHTML()
        {

            using (var sw = new StringWriter())
            {

                ToWriter(new HTMLISerializedObjectWriter(sw));
                sw.WriteLine("</body></html>");
                return sw.ToString();
            }
        }

        internal void SortBy(string name)
        {
            _list.Sort((a, b) =>
            {
                return Firefly.Box.Advanced.Comparer.Compare(a.Get(name), b.Get(name));
            });
        }

        public IEnumerator<DataItem> GetEnumerator()
        {
            return _list.GetEnumerator();
        }


        IEnumerator IEnumerable.GetEnumerator()
        {
            return _list.GetEnumerator();
        }
        public int Count { get { return _list.Count; } }
        public DataItem this[int i] { get { return _list[i]; } }
    }
    class JsonParser
    {
        static void error(char c, object o)
        {
            throw new NotImplementedException(c + " in " + o.GetType());
        }

        public object FromJson(string s)
        {
            var sp = new ENV.Utilities.StringParser();
            object result = null;
            sp.Parse(s.Trim(), new valueReader((n, v) => result = v, new EndOfString()));
            return result;
        }

        class arrayReader : ENV.Utilities.CharProcessor
        {
            DataList _dl = new DataList();
            Action<DataList> _done;
            CharProcessor _next;
            public arrayReader(Action<DataList> done, CharProcessor next)
            {
                _done = done;
                _next = next;
            }
            public void Finish()
            {
                throw new NotImplementedException();
            }

            public void Process(char c, SetCharProcessor setState)
            {
                switch (c)
                {
                    case '{':
                        setState(new objectReader(_dl.AddItem, this), false);
                        break;
                    case ',':
                        break;
                    case ']':

                        _done(_dl);
                        setState(_next, false);
                        break;
                    case ' ':
                    case '\t':
                    case '\r':
                    case '\n':
                        break;
                    default:
                        error(c, this);
                        break;
                }
            }
        }
        class objectReader : CharProcessor
        {
            public DataItem di = new DataItem();
            Action<DataItem> _done;
            CharProcessor _nextProcessor;
            public objectReader(Action<DataItem> done, CharProcessor next)
            {
                _done = done;
                _nextProcessor = next;
            }
            public void Finish()
            {
                throw new NotImplementedException();
            }

            public void Process(char c, SetCharProcessor setState)
            {
                switch (c)
                {
                    case '}':
                        _done(di);
                        setState(_nextProcessor, false);
                        break;
                    case ',':
                        break;
                    case ' ':
                    case '\t':
                    case '\r':
                    case '\n':
                        break;
                    default:
                        var vr = new valueReader((n, v) => di.Set(n, v), this);
                        setState(new ReadValueThatMayOrMayNotBeQuoted(vr, ':', vr.setName), c != ',');
                        break;
                }
            }


        }
        class valueReader : CharProcessor
        {

            CharProcessor _next;
            Action<string, object> _done;
            public valueReader(Action<string, object> done, CharProcessor next)
            {
                _done = done;
                _next = next;
            }
            public void Finish()
            {
                throw new NotImplementedException();
            }

            public void Process(char c, SetCharProcessor setState)
            {
                switch (c)
                {
                    case '{':
                        setState(new objectReader(s => _done(_name, s), _next), false);
                        break;
                    case '[':
                        setState(new arrayReader(s => _done(_name, s), _next), false);
                        break;
                    case ':':
                        break;
                    case ' ':
                    case '\t':
                    case '\r':
                    case '\n':
                        break;
                    default:

                        setState(new ReadValueThatMayOrMayNotBeQuoted(_next, new char[] { ',', '}' }, s => _done(_name,
                            s.Replace("\\n", "\n")
                            .Replace("\\r", "\r")
                            .Replace("\\t", "\t"))), true);
                        break;
                }
            }
            string _name;
            internal void setName(string obj)
            {
                _name = obj;
            }
        }


    }
}
namespace ENV.Web.DataListHelpers
{
    public static class EntityHelper
    {
        public static string ExportToJson(this ENV.Data.Entity entity, FilterBase where = null, Sort orderBy = null, params ColumnBase[] columns)
        {
            var vmc = new ViewModel
            {
                From = entity
            };
            if (where != null)
                vmc.Where.Add(where);
            if (orderBy != null)
                vmc.OrderBy = orderBy;
            return vmc.ExportRows().ToJson();
        }
        public static void ImportFromJson(this ENV.Data.Entity entity, string json, bool ignoreDuplicateRows = false)
        {
            var vmc = new ViewModel { From = entity };
            var dl = DataList.FromJson(json);
            vmc.ImportRows(dl, ignoreDuplicateRows: ignoreDuplicateRows);

        }
    }
}
