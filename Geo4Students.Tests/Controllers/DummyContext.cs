using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Tests.Controllers
{
    public class DummyContext
    {
        public Land Land{ get; private set; }
        public Klimatogram Klimatogram1 { get; private set; }
        public Klimatogram Klimatogram2 { get; private set; }
        public List<Klimatogram> Klimatogrammen { get; private set; }
        public int landID { get { return 0; } }
        public int klimatogramID { get { return 0; } }

        public DummyContext ()
        {
            Land = new Land();
            Klimatogram1 = new Klimatogram("k1", "w1", 1.0, 2.0, 1950, 2000);
            Klimatogram2 = new Klimatogram("k2", "w2", 1.0, 2.0, 1950, 2000);

            Klimatogrammen = new List<Klimatogram> {Klimatogram1, Klimatogram2};
            Land.Klimatogrammen = Klimatogrammen;
        }
        
    }
}
