using System.Data.Entity;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain.Determinatietabellen;

namespace Geo4Students.Models.Repository
{
    public class DeterminatietabelRepository : IGenericRepository<Determinatietabel>
    {
        private readonly GeoContext _context;
        private readonly DbSet<Determinatietabel> _tabellen;

        public DeterminatietabelRepository(GeoContext context)
        {
            _context = context;
            _tabellen = _context.Determinatietabel;
        }

        public IQueryable<Determinatietabel> FindAll()
        {
            return _tabellen;
        }

        public Determinatietabel Get(object id)
        {
            return _tabellen.Find(id);
        }

        public void Delete(Determinatietabel obj)
        {
            _tabellen.Remove(obj);
        }

        public void Insert(Determinatietabel obj)
        {
            _tabellen.Add(obj);
        }

        public bool Exists(object id)
        {
            return _tabellen.Contains(id);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}