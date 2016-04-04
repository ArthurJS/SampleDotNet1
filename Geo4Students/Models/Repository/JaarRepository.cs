using System.Data.Entity;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain;

namespace Geo4Students.Models.Repository
{
    public class JaarRepository : IGenericRepository<Jaar>
    {
        private readonly GeoContext _context;
        private readonly DbSet<Jaar> _jaren;

        public JaarRepository(GeoContext context)
        {
            _context = context;
            _jaren = _context.Jaar;
        }

        public IQueryable<Jaar> FindAll()
        {
            return _jaren;
        }

        public Jaar Get(object id)
        {
            return _jaren.Find(id);
        }

        public void Delete(Jaar obj)
        {
            _jaren.Remove(obj);
        }

        public void Insert(Jaar obj)
        {
            _jaren.Add(obj);
        }

        public bool Exists(object id)
        {
            return _jaren.Find(id) != null;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}