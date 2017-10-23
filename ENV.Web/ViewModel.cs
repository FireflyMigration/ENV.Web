using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Firefly.Box;

using Firefly.Box.Data.Advanced;
using ENV.Utilities;
using Firefly.Box.Advanced;

using System.IO;
using System.Xml;
using Firefly.Box.Testing;
using System.Web;
using ENV.Data;

namespace ENV.Web
{
    public class ViewModel
    {

        protected readonly ENV.UserMethods u;
        public ViewModel()
        {
            u = UserMethods.Instance;
            _bp.Load += OnLoad;
            _bp.SavingRow += e =>
            {

                if (!ModelState.IsValid)
                {
                    e.Cancel = true;
                    if (_bp.InTransaction)
                        throw new RollbackException(false);
                }
            };
            ModelState._translateColumn = c => _colMap[c].Key;
        }
        protected internal Activities Activity { get { return _bp.Activity; } }
        protected virtual void OnLoad() { }
        public ViewModel(Firefly.Box.Data.Entity e, bool allowInsertUpdateDelete = false) : this()
        {
            From = e;
            if (allowInsertUpdateDelete)
            {
                AllowInsertUpdateDelete();
            }

        }
        internal void AssertColumnKey(ColumnBase c, string key)
        {
            _colMap[c].AssertKey(key);
        }
        protected void MapExperssion(string name, Func<Text> exp)
        {
            AddExpressionColumn(Columns.Add(new TextColumn(name)).BindValue(exp));

        }
        void AddExpressionColumn(ColumnBase col)
        {
            DenyUpdate(col);
            MapColumn(col);
        }
        protected void MapExperssion(string name, Func<Bool> exp)
        {
            AddExpressionColumn(Columns.Add(new BoolColumn(name)).BindValue(exp));

        }
        protected void MapExperssion(string name, Func<Number> exp)
        {
            AddExpressionColumn(Columns.Add(new NumberColumn(name)).BindValue(exp));

        }
        protected void AddAllColumns()
        {
            _bp.AddAllColumns();
        }
        protected void AllowInsertUpdateDelete()
        {
            AllowUpdate = true;
            AllowDelete = true;
            AllowInsert = true;
        }

        BusinessProcess _bp = new BusinessProcess() { TransactionScope = TransactionScopes.Task };

        bool _init = false;
        FilterCollection _tempFilter = new FilterCollection();
        protected RelationCollection Relations { get { return _bp.Relations; } }
        protected FilterCollection Where { get { return _bp.Where; } }
        protected Sort OrderBy { get { return _bp.OrderBy; } }
        protected internal ColumnCollection Columns => _bp.Columns;
        protected internal bool AllowUpdate { get; set; }
        protected internal bool AllowDelete { get; set; }
        protected internal bool AllowInsert { get; set; }
        protected internal Firefly.Box.Data.Entity From { get { return _bp.From; } set { _bp.From = value; } }

        protected virtual void OnSavingRow()
        {
        }
        void init()
        {
            if (_init)
                return;
            _init = true;
            if (_columns.Count == 0)
            {
                if (_bp.Columns.Count == 0)
                    _bp.AddAllColumns();
                MapColumns(_bp.Columns);
            }
            if (!_colMap.ContainsKey(_idColumn))
            {
                MapColumns(new[] { _idColumn });
            }
            _bp.Where.Add(_tempFilter);

        }
        internal static ContextStatic<IMyHttpContext> HttpContext = new ContextStatic<IMyHttpContext>(() => new HttpContextBridgeToIHttpContext(System.Web.HttpContext.Current));
        public DataList GetRows()
        {
            init();
            var dl = new DataList();

            foreach (var item in _colsPerKey)
            {
                item.Value.addFilter(HttpContext.Value.GetRequestParam(item.Key), _tempFilter, new equalToFilter());
                item.Value.addFilter(HttpContext.Value.GetRequestParam(item.Key + "_gt"), _tempFilter, new greater());
                item.Value.addFilter(HttpContext.Value.GetRequestParam(item.Key + "_gte"), _tempFilter, new greaterEqual());
                item.Value.addFilter(HttpContext.Value.GetRequestParam(item.Key + "_lt"), _tempFilter, new lesser());
                item.Value.addFilter(HttpContext.Value.GetRequestParam(item.Key + "_lte"), _tempFilter, new lessOrEqual());
                item.Value.addFilter(HttpContext.Value.GetRequestParam(item.Key + "_ne"), _tempFilter, new different());
            }
            long start = 0;
            long numOfRows = 25;
            {
                var limit = HttpContext.Value.GetRequestParam("_limit");
                if (!string.IsNullOrEmpty(limit))
                    numOfRows = Number.Parse(limit);
                if (Number.IsNullOrZero(numOfRows))
                    numOfRows = 25;
            }
            if (numOfRows > 0)
            {
                var page = HttpContext.Value.GetRequestParam("_page");
                if (!string.IsNullOrEmpty(page))
                {

                    var x = Number.Parse(page);
                    if (x > 0)
                        start = (x - 1) * numOfRows;
                }
            }
            var ob = _bp.OrderBy;
            var sort = HttpContext.Value.GetRequestParam("_sort");
            if (!string.IsNullOrEmpty(sort))
            {
                var orderBy = new Sort();
                var s = sort.Split(',');
                var ord = HttpContext.Value.GetRequestParam("_order") ?? "";
                var o = ord.Split(',');
                for (int i = 0; i < s.Length; i++)
                {
                    ColumnInViewModel cvm;
                    if (_colsPerKey.TryGetValue(s[i], out cvm))
                    {
                        var so = SortDirection.Ascending;
                        if (o.Length > i && o[i].ToLower().StartsWith("d"))
                            so = SortDirection.Descending;
                        cvm.AddSort(orderBy, so);
                    }
                }
                if (orderBy.Segments.Count > 0)
                    _bp.OrderBy = orderBy;
            }
            try
            {
                _bp.ForEachRow(() =>
                {
                    if (_bp.Counter > start)
                        dl.AddItem(GetItem());
                    if (_bp.Counter == start + numOfRows)
                        _bp.Exit();

                });
                return dl;
            }
            finally
            {
                _bp.OrderBy = ob;
                _tempFilter.Clear();
            }
        }
        public void Describe(TextWriter tw, string name)
        {
            tw.WriteLine("export class " + name + " extends entity {");
            init();
            foreach (var item in _columns)
            {
                tw.WriteLine("    " + item.Key + " = new stringColumn('" + item.Caption + "');");
            }
            tw.WriteLine(@"    constructor(ds?: dataSource) {
        super(ds ? ds : shared.server, '" + name + @"');
        this.initColumns(this.id);
    }");
            tw.WriteLine("}");
        }
        public void CreateTypeScriptClass(TextWriter tw, string name, string url)
        {
            init();




            tw.WriteLine($@"export class {name} extends utils.entity {{");
            foreach (var item in _columns)
            {
                tw.WriteLine($"    {item.Key} = new utils.{item.getColumnType()}('{item.Caption}');");
            }
            tw.WriteLine($@"
    constructor() {{
        super('{url}');
        this.initColumns();
    }}
}}");
            
            
            
            
        }
        public void CreateTypeScriptInterface(TextWriter tw, string name, string url)
        {


            var singular = NameFixer.MakeSingular(name);


            tw.WriteLine($@"export class {name} extends utils.DataSettings&lt;{singular}&gt;{{
    constructor(settings?: utils.IDataSettings&lt;{singular}&gt;) {{
        super('{url}', settings);
    }}
}}");
            tw.WriteLine("export interface " + singular + " {");
            init();
            foreach (var item in _columns)
            {
                tw.WriteLine($"    {item.Key}?:{item.getJsonType()};");
            }
            tw.WriteLine("}");
        }
        public void ColumnKeys(TextWriter tw)
        {
            init();
            tw.WriteLine("columnKeys:[");
            tw.Write("    ");
            bool first = true;
            foreach (var item in _columns)
            {
                if (first)
                    first = false;
                else
                    tw.Write(",");
                tw.Write("\"" + item.Key + "\"");
            }
            tw.WriteLine();
            tw.WriteLine("]");
        }
        public void FullColumnList(TextWriter tw)
        {
            init();
            tw.WriteLine("columnSettings:[");
            bool first = true;
            foreach (var item in _columns)
            {
                if (first)
                    first = false;
                else
                    tw.WriteLine(",");
                tw.Write("   {key:\"" + item.Key + "\", caption:\"" + item.Caption.Replace("\"", "\"\"") + "\"");
                if (item.IsReadOnly(_denyUpdateColumns, _onlyAllowUpdateOf, _ignoreUpdateOf, _bp.From))
                    tw.Write(", readonly:true");
                if (item.getInputType() != "text")
                    tw.Write(", inputType:\"" + item.getInputType() + "\"");
                tw.Write(" }");
            }
            tw.WriteLine();
            tw.WriteLine("]");
        }
        DataItem GetItem()
        {
            if (!_init)
                throw new InvalidOperationException("Init was not run");
            var x = new DataItem();
            foreach (var item in _columns)
            {
                item.SaveTo(x);
            }
            return x;
        }
        void forId(string id, Action what, Activities activity = Activities.Update, Action onEnd = null)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new InvalidOperationException("id was not provided");
            try
            {
                init();
                if (_bp.From.PrimaryKeyColumns.Length == 1)
                {
                    var x = new equalToFilter();
                    Caster.Cast(_idColumn, id, x);
                    _tempFilter.Add(x.result);
                }
                else
                {
                    var sr = new SeperatedReader(id);
                    int i = 0;
                    foreach (var item in _bp.From.PrimaryKeyColumns)
                    {
                        var x = new equalToFilter();
                        Caster.Cast(item, sr[i++], x);
                        _tempFilter.Add(x.result);

                    }
                }
                if (onEnd != null)
                    _bp.End += onEnd;
                _bp.Activity = activity;
                what();
            }
            finally
            {
                if (_bp.Counter == 0)
                    throw new NotFoundException();
                _bp.Activity = Activities.Update;
                if (onEnd != null)
                    _bp.End -= onEnd;

                _tempFilter.Clear();
            }
        }

        internal void ProvideMembersTo(DataList dl)
        {
            init();
            foreach (var item in _columns)
            {
                var i = dl.AddItem();
                i.Set("Key", item.Key);
                i.Set("Caption", item.Caption);
                i.Set("Type", item.getJsonType());
                i.Set("Input Type", item.getInputType());
                i.Set("Readonly", item.IsReadOnly(_denyUpdateColumns, _onlyAllowUpdateOf, _ignoreUpdateOf, _bp.From) ? "true" : "");

            }
        }

        public DataItem GetRow(string id)
        {
            DataItem result = null;
            forId(id, () =>
            {
                _bp.ForFirstRow(() =>
                {
                    result = GetItem();

                });
            });
            return result;
        }
        public void Delete(string id)
        {
            forId(id, () =>
            {
                _bp.ForFirstRow(() => { });
            }, Activities.Delete);
        }
        public DataItem Update(string id, DataItem item)
        {
            DataItem result = null;
            forId(id, () =>
            {

                _bp.ForFirstRow(() =>
                {
                    UpdateColumnsBasedIn(item);

                });

            }, Activities.Update, () => result = GetItem());
            return result;
        }

        private void UpdateColumnsBasedIn(DataItem item)
        {
            foreach (var c in _columns)
            {
                c.UpdateDataBasedOnItem(item, _denyUpdateColumns, _onlyAllowUpdateOf, ModelState, _bp.From, _ignoreUpdateOf);
            }
            try
            {
                if (ModelState.IsValid)
                    OnSavingRow();
            }
            catch (FlowAbortException ex)
            {
                ModelState.AddError(ex);
                throw;
            }

        }

        public DataItem Insert(DataItem item)
        {
            init();
            DataItem result = null;
            Action onEnd = () =>
              {
                  result = GetItem();
              };
            try
            {
                _bp.Activity = Activities.Insert;

                _bp.End += onEnd;
                _bp.ForFirstRow(() =>
                {
                    UpdateColumnsBasedIn(item);
                });
                return result;
            }
            finally
            {
                _bp.Activity = Activities.Update;
                _bp.End -= onEnd;
            }
        }

        class ColumnInViewModel
        {
            string _key;
            Func<object> _getValueFromRow;
            Action<DataItemValue> _setValueBasedOnDataItem;
            ColumnBase _col;
            public ColumnInViewModel(string key, Func<object> getValue, Action<DataItemValue> setValue, ColumnBase col)
            {
                _col = col;
                _key = key;
                _getValueFromRow = getValue;
                _setValueBasedOnDataItem = setValue;
            }

            internal void addFilter(string dataItemValue, FilterCollection tempFilter, filterAbstract f)
            {
                if (dataItemValue == null)
                    return;

                Caster.Cast(_col, dataItemValue, f);
                if (f.result != null)
                {
                    tempFilter.Add(f.result);
                }
            }


            internal void AddSort(Sort orderBy, SortDirection so)
            {
                orderBy.Add(_col, so);
            }

            internal void AssertKey(string key)
            {
                _key.ShouldBe(key);
            }
            public string Key => _key;
            public string Caption => _col.Caption;


            internal void SaveTo(DataItem x)
            {
                x.Set(_key, _getValueFromRow());
            }

            internal void UpdateDataBasedOnItem(DataItem item, HashSet<ColumnBase> denyUpdateOf, HashSet<ColumnBase> onlyAllowUpdateOf, ViewModelState state, Firefly.Box.Data.Entity updatebleEntity, HashSet<ColumnBase> ignoreUpdateOf)
            {
                if ((_col.Entity == null || _col.Entity == updatebleEntity) && !ignoreUpdateOf.Contains(_col))
                {
                    _setValueBasedOnDataItem(item[_key]);

                    if (!Comparer.Equal(_col.OriginalValue, _col.Value))
                    {
                        if (IsReadOnly(denyUpdateOf, onlyAllowUpdateOf, ignoreUpdateOf, updatebleEntity))
                            state.AddError(_col, "cannot be updated");
                    }
                }
            }

            internal bool IsReadOnly(HashSet<ColumnBase> denyUpdateOf, HashSet<ColumnBase> onlyAllowUpdateOf, HashSet<ColumnBase> ignoreUpdateOf, Firefly.Box.Data.Entity updatebleEntity)
            {
                return denyUpdateOf.Contains(_col) || onlyAllowUpdateOf.Count > 0 && !onlyAllowUpdateOf.Contains(_col) || _col.DbReadOnly || ignoreUpdateOf.Contains(_col) || (_col.Entity != null && _col.Entity != updatebleEntity);
            }

            internal string getJsonType()
            {
                if (_col is BoolColumn)
                    return "boolean";
                else if (_col is NumberColumn)
                    return "number";
                return "string";
            }
            internal string getInputType()
            {

                if (_col is BoolColumn)
                    return "checkbox";
                else if (_col is NumberColumn)
                    return "number";
                else if (_col is DateColumn)
                    return "date";
                else if (_col is TimeColumn)
                    return "time";
                return "text";
            }

            internal object getColumnType()
            {
                if (_col is BoolColumn)
                    return "boolColumn";
                else if (_col is NumberColumn)
                    return "numberColumn";
                else if (_col is DateColumn)
                    return "dateColumn";
                else if (_col is TimeColumn)
                    return "timeColumn";
                return "textColumn";
            }
        }
        List<ColumnInViewModel> _columns = new List<ColumnInViewModel>();
        Dictionary<ColumnBase, ColumnInViewModel> _colMap = new Dictionary<ColumnBase, ColumnInViewModel>();
        Dictionary<string, ColumnInViewModel> _colsPerKey = new Dictionary<string, ColumnInViewModel>();
        bool _handledIdentity = false;
        ColumnBase _idColumn;
        internal protected void MapColumn(params ColumnBase[] columns)
        {
            MapColumns(columns);
        }
        HashSet<ColumnBase> _denyUpdateColumns = new HashSet<ColumnBase>(),
            _onlyAllowUpdateOf = new HashSet<ColumnBase>(),
            _ignoreUpdateOf = new HashSet<ColumnBase>();
        internal protected void DenyUpdate(params ColumnBase[] columns)
        {
            foreach (var item in columns)
            {
                _denyUpdateColumns.Add(item);
            }
        }
        internal protected void IgnoreUpdateOf(params ColumnBase[] columns)
        {
            foreach (var item in columns)
            {
                _ignoreUpdateOf.Add(item);
            }
        }
        internal protected void OnlyAllowUpdateOf(params ColumnBase[] columns)
        {
            foreach (var item in columns)
            {
                _onlyAllowUpdateOf.Add(item);
            }
        }
        void MapColumns(IEnumerable<ColumnBase> columns)
        {

            if (!_handledIdentity)
            {
                _handledIdentity = true;
                if (_bp.From == null)
                    throw new NotImplementedException("Must have an Entity - did you forget to set the From");
                if (_bp.From.PrimaryKeyColumns == null || _bp.From.PrimaryKeyColumns.Length == 0)
                    throw new NotImplementedException("Entity must have a primary key");

                if (_bp.From.PrimaryKeyColumns.Length == 1)
                {
                    _idColumn = _bp.From.PrimaryKeyColumns[0];

                }
                else
                {
                    _idColumn = new TextColumn("id").BindValue(() =>
                    {

                        var x = new SeperatedBuilder();
                        foreach (var item in _bp.From.PrimaryKeyColumns)
                        {
                            x.Add(DataItem.FixValueTypes(item.Value));
                        }
                        return x.ToString();
                    });
                    Columns.Add(_bp.From.PrimaryKeyColumns);
                    Columns.Add(_idColumn);
                    IgnoreUpdateOf(_idColumn);


                }

            }
            foreach (var column in columns)
            {
                string name = column.Caption;
                if (column == _idColumn)
                    name = "id";
                name = NameFixer.fixName(name);
                var orgName = name;
                int i = 1;
                while (_colsPerKey.ContainsKey(name))
                {
                    name = orgName + (i++).ToString();
                }
                var cv = new ColumnInViewModel(name, () => column.Value, v =>
                {
                    Caster.Cast(column, v, new setValueForColumn());
                }, column);
                _colMap.Add(column, cv);
                _colsPerKey.Add(name, cv);
                _columns.Add(cv);
                Columns.Add(column);
            }
        }



        ViewModelState _modelState = new ViewModelState();
        protected internal ViewModelState ModelState { get { return _modelState; } }








    }
    class setValueForColumn : DoSomething
    {
        public void What<T>(TypedColumnBase<T> c, T val)
        {
            if (!Firefly.Box.Advanced.Comparer.Equal(c.Value, val))
                c.Value = val;
        }
    }


    interface DoSomething
    {
        void What<T>(TypedColumnBase<T> col, T val);
    }
    abstract class filterAbstract : DoSomething
    {
        public FilterBase result;
        public abstract void What<T>(TypedColumnBase<T> col, T val);
    }
    class equalToFilter : filterAbstract
    {
        public override void What<T>(TypedColumnBase<T> col, T val)
        {
            result = col.IsEqualTo(val);
        }
    }
    class greater : filterAbstract
    {
        public override void What<T>(TypedColumnBase<T> col, T val)
        {
            result = col.IsGreaterThan(val);
        }
    }
    class greaterEqual : filterAbstract
    {
        public override void What<T>(TypedColumnBase<T> col, T val)
        {
            result = col.IsGreaterOrEqualTo(val);
        }
    }
    class lesser : filterAbstract
    {
        public override void What<T>(TypedColumnBase<T> col, T val)
        {
            result = col.IsLessThan(val);
        }
    }
    class lessOrEqual : filterAbstract
    {
        public override void What<T>(TypedColumnBase<T> col, T val)
        {
            result = col.IsLessOrEqualTo(val);
        }
    }
    class different : filterAbstract
    {
        public override void What<T>(TypedColumnBase<T> col, T val)
        {
            result = col.IsDifferentFrom(val);
        }
    }

    class Caster : UserMethods.IColumnSpecifier
    {
        DataItemValue _v;
        public FilterBase result;
        DoSomething _ds;
        public static void Cast(ColumnBase c, DataItemValue v, DoSomething d)
        {
            UserMethods.CastColumn(c, new Caster(v, d));
        }
        public static void Cast(ColumnBase c, string v, DoSomething d)
        {
            UserMethods.CastColumn(c, new Caster(new DataItemValue(v), d));
        }
        public Caster(DataItemValue v, DoSomething ds)
        {
            _ds = ds;
            _v = v;
        }
        public void DoOnColumn(TypedColumnBase<Firefly.Box.Text> column)
        {
            _ds.What(column, _v.GetValue<Text>());
        }

        public void DoOnColumn(TypedColumnBase<Number> column)
        {
            _ds.What(column, _v.GetValue<Number>());
        }

        public void DoOnColumn(TypedColumnBase<Date> column)
        {
            _ds.What(column, _v.GetValue<Date>());
        }

        public void DoOnColumn(TypedColumnBase<Time> column)
        {
            _ds.What(column, _v.GetValue<Time>());
        }

        public void DoOnColumn(TypedColumnBase<Bool> column)
        {
            _ds.What(column, _v.GetValue<Bool>());
        }

        public void DoOnColumn(TypedColumnBase<byte[]> column)
        {
            throw new NotImplementedException();
        }

        public void DoOnUnknownColumn(ColumnBase column)
        {
            throw new NotImplementedException();
        }
    }
    public class ViewModelState
    {
        internal Func<ColumnBase, string> _translateColumn = x => x.Caption;

        public string Message { get; set; }
        public bool IsValid { get { return string.IsNullOrWhiteSpace(Message) && _errors.Count == 0; } }
        Dictionary<string, List<string>> _errors = new Dictionary<string, List<string>>();
        public void AddErrorByKey(string key, string message)
        {
            List<string> errors;
            if (!_errors.TryGetValue(key, out errors))
                _errors.Add(key, errors = new List<string>());
            errors.Add(message);
            if (string.IsNullOrWhiteSpace(Message))
                Message = key + ": " + message;


        }
        public void AddError(ColumnBase column, string message)
        {
            AddErrorByKey(_translateColumn(column), message);
        }
        public void AddError(string message)
        {
            if (string.IsNullOrWhiteSpace(Message))
                Message = message;
        }
        public void AddError<T>(TypedColumnBase<T> column, string message)
        {
            AddErrorByKey(_translateColumn(column), message);
        }
        public void Validate<T>(TypedColumnBase<T> column, Func<T, bool> validCondition, string message)
        {
            if (!validCondition(column.Value))
                AddErrorByKey(_translateColumn(column), message);
        }
        public void AddError(Exception ex)
        {
            AddError(ex.Message);
        }

        internal string ToJson()
        {
            var di = new DataItem();
            if (String.IsNullOrEmpty(Message))
                Message = "The request is invalid";
            di.Set("Message", Message);
            var ms = new DataItem();
            var add = false;
            foreach (var item in _errors)
            {
                ms.Set(item.Key, item.Value.ToArray());
                add = true;
            }
            if (add)
                di.Set("ModelState", ms);



            return di.ToJson();
        }

        internal void ApplyNotFound(HttpResponse response)
        {
            response.StatusCode = 404;
            AddError("Not found");
            response.Write(ToJson());
        }

        public void Required(Data.NumberColumn col, string message = "Required")
        {
            Validate(col, v => !Number.IsNullOrZero(v), message);
        }
        public void Required(Data.TextColumn col, string message = "Required")
        {
            Validate(col, v => !Text.IsNullOrEmpty(v), message);
        }
        public void Required(Data.DateColumn col, string message = "Required")
        {
            Validate(col, v => !Date.IsNullOrEmpty(v), message);
        }
        public void Required(Data.TimeColumn col, string message = "Required")
        {
            Validate(col, v => !Time.IsNullOrStartOfDay(v), message);
        }

        public void Exists<T>(TypedColumnBase<T> column, TypedColumnBase<T> equalToColumn, string message = "Was not found in {0}")
        {
            if (!(equalToColumn.Entity is ENV.Data.Entity))
                throw new InvalidOperationException("Invalid entity type");

            Validate(column, v => ((ENV.Data.Entity)equalToColumn.Entity).Contains(equalToColumn.IsEqualTo(column))
            , string.Format(message, equalToColumn.Entity.Caption));
        }
    }

}
