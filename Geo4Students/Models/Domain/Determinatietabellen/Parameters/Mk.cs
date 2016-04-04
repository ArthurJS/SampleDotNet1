using System;
using System.Collections.Generic;
using System.Linq;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class Mk : Parameter
    {
        public override string Omschrijving
        {
            get { return "Wat is de koudste maand?"; }
        }

        public override string Code
        {
            get { return "Mk"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            return klimatogram.KoudsteMaand;
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            return (from Maand m in Enum.GetValues(typeof (Maand)) select m.ToString()).ToList();
        }
    }
}