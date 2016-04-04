using System;
using System.Collections.Generic;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class Tm : Parameter
    {
        private readonly int maanden;

        public Tm(int maanden)
        {
            this.maanden = maanden;
        }

        public override string Omschrijving
        {
            get { return ""; }
        }

        public override string Code
        {
            get { return "minder dan " + maanden + " maanden Tm"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            throw new NotImplementedException();
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            return null;
        }
    }
}