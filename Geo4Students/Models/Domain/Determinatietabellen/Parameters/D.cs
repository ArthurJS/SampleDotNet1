using System.Collections.Generic;
using System.Linq;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class D : Parameter
    {
        public override string Omschrijving
        {
            get { return "Hoeveel droge maanden zijn er?"; }
        }

        public override string Code
        {
            get { return "D"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            List<string> list = new List<string>();
            list.Add(klimatogram.DrogeMaanden.ToString());
            return list;
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            string[] aantal = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"};
            return aantal.ToList();
        }
    }
}