using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENV.Data;
using ENV.Data.DataProvider;

namespace ENV.Web.Tests
{
    public class MockTable:Entity

    {
        public static MemoryDatabase db = new MemoryDatabase();
        [PrimaryKey]
        public readonly NumberColumn a = new NumberColumn("c1","5");
        public readonly NumberColumn b = new NumberColumn("c2","5");
        public readonly TextColumn C = new TextColumn("c3","30");
        public MockTable() : base("t1", db) { }

        internal void InsertRow(int a, int b, string c)
        {
            Insert(() => {
                this.a.Value = a;
                this.b.Value = b;
                this.C.Value = c;
            });
        }
    }
    

}
