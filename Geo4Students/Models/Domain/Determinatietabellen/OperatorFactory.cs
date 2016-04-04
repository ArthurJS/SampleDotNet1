namespace Geo4Students.Models.Domain.Determinatietabellen
{
    public class OperatorFactory
    {
        public static Operator CreateOperator(string value)
        {
            switch (value.ToLower())
            {
                case "<":
                    return Operator.KleinerDan;
                case ">":
                    return Operator.GroterDan;
                case "<=":
                    return Operator.KleinerOfGelijkAan;
                case ">=":
                    return Operator.GroterOfGelijkAan;
                case "=":
                    return Operator.GelijkAan;
            }
            return Operator.GelijkAan;
        }

        public static bool ExecuteOperator(Operator oper, double p1, double p2)
        {
            switch (oper)
            {
                case Operator.GelijkAan:
                    return p1 == p2;
                case Operator.KleinerDan:
                    return p1 < p2;
                case Operator.GroterDan:
                    return p1 > p2;
                case Operator.KleinerOfGelijkAan:
                    return p1 <= p2;
                case Operator.GroterOfGelijkAan:
                    return p1 >= p2;
            }
            return false;
        }
    }
}