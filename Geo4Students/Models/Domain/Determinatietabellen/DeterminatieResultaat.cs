using System;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen
{
    [Serializable]
    public class DeterminatieResultaat : DeterminatieComponent
    {
        public string KlimaatKenmerk { get; set; }
        public string VegetatieKenmerk { get; set; }

        public override string ToString()
        {
            return KlimaatKenmerk;
        }

        public override DeterminatieResultaat Determineer(Klimatogram klimatogram)
        {
            return this;
        }
    }
}