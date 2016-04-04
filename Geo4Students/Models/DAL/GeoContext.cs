using System.Data.Entity;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Determinatietabellen;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.DAL
{
    public class GeoContext : DbContext
    {
        public GeoContext()
            : base("name=GeoContext")
        {
        }

        public virtual DbSet<Continent> Continent { get; set; }
        public virtual DbSet<DeterminatieComponent> DeterminatieComponent { get; set; }
        public virtual DbSet<Determinatietabel> Determinatietabel { get; set; }
        public virtual DbSet<Jaar> Jaar { get; set; }
        public virtual DbSet<Klimatogram> Klimatogram { get; set; }
        public virtual DbSet<Land> Land { get; set; }
        public virtual DbSet<Meting> Meting { get; set; }
        public virtual DbSet<Voorwaarde> Voorwaarde { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Voorwaarde>()
                .Property(e => e.BaseValue)
                .IsUnicode(true);

            modelBuilder.Entity<Voorwaarde>()
                .Property(e => e.ComparingValue)
                .IsUnicode(true);

            modelBuilder.Entity<Voorwaarde>()
                .Property(e => e.Operator)
                .IsUnicode(true);

            modelBuilder.Entity<Voorwaarde>()
                .Property(e => e.Unit)
                .IsUnicode(true);

            modelBuilder.Entity<Determinatietabel>()
                .HasRequired(e => e.Component).WithMany().Map(x => x.MapKey("Component_ComponentId"));

            modelBuilder.Entity<Determinatietabel>()
                .Property(e => e.Naam)
                .IsUnicode(true);

            modelBuilder.Entity<Jaar>()
                .HasMany(e => e.Continenten)
                .WithMany()
                .Map(
                    m =>
                        m.ToTable("Jaar_Continent")
                            .MapLeftKey("Jaar_Leerjaar")
                            .MapRightKey("Continent_ContinentId"));

            modelBuilder.Entity<Jaar>()
                .HasRequired(e => e.Determinatietabel)
                .WithMany()
                .Map(x => x.MapKey("DeterminatieTabel_DeterminatieTabelId"));

            modelBuilder.Entity<DeterminatieComponent>()
                .Map<DeterminatieResultaat>(m => m.Requires("DTYPE").HasValue("DeterminatieResultaat"))
                .Map<DeterminatieVoorwaarde>(m => m.Requires("DTYPE").HasValue("DeterminatieVoorwaarde"));

            modelBuilder.Entity<DeterminatieComponent>()
                .HasRequired(e => e.Parent).WithMany().Map(x => x.MapKey("Parent_ComponentId"));

            modelBuilder.Entity<DeterminatieVoorwaarde>()
                .HasRequired(e => e.Yes).WithMany().Map(x => x.MapKey("Yes_ComponentId"));

            modelBuilder.Entity<DeterminatieVoorwaarde>()
                .HasRequired(e => e.No).WithMany().Map(x => x.MapKey("No_ComponentId"));

            modelBuilder.Entity<DeterminatieVoorwaarde>()
                .HasRequired(e => e.Voorwaarde).WithOptional().Map(x => x.MapKey("Voorwaarde_VoorwaardeId"));

            modelBuilder.Entity<DeterminatieResultaat>()
                .Property(e => e.KlimaatKenmerk)
                .IsUnicode(true);

            modelBuilder.Entity<DeterminatieResultaat>()
                .Property(e => e.VegetatieKenmerk)
                .IsUnicode(true);

            modelBuilder.Entity<Klimatogram>()
                .Property(e => e.Naam)
                .IsUnicode(true);

            modelBuilder.Entity<Klimatogram>()
                .Property(e => e.Weerstation)
                .IsUnicode(true);

            modelBuilder.Entity<Klimatogram>()
                .HasMany(e => e.Metingen);

            modelBuilder.Entity<Continent>()
                .Property(e => e.Naam)
                .IsUnicode(true);

            modelBuilder.Entity<Continent>()
                .HasMany(e => e.Landen);

            modelBuilder.Entity<Land>()
                .Property(e => e.Naam)
                .IsUnicode(true);

            modelBuilder.Entity<Land>()
                .HasMany(e => e.Klimatogrammen);
        }
    }
}