using System;
using System.Linq;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen
{
    [Serializable]
    public class DeterminatieVoorwaarde : DeterminatieComponent
    {
        public virtual Voorwaarde Voorwaarde { get; set; }
        public virtual DeterminatieComponent Yes { get; set; }
        public virtual DeterminatieComponent No { get; set; }

        public override string ToString()
        {
            return Voorwaarde.ToString();
        }

        public override DeterminatieResultaat Determineer(Klimatogram klimatogram)
        {
            var para1 = ParameterFactory.CreateParameter(Voorwaarde.BaseValue).Execute(klimatogram);
            var p2 = ParameterFactory.CreateParameter(Voorwaarde.ComparingValue);
            var para2 = p2 == null ? Voorwaarde.ComparingValue : p2.Execute(klimatogram).First();
            var baseValue = double.Parse(para1.First());
            var comparingValue = double.Parse(para2);
            var oper = OperatorFactory.CreateOperator(Voorwaarde.Operator);
            return OperatorFactory.ExecuteOperator(oper, baseValue, comparingValue)
                ? Yes.Determineer(klimatogram)
                : No.Determineer(klimatogram);
        }
    }
}