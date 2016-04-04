/**
* Toon een determinatietabel.
*/
var kleuren = {
    'standaardKnoopKleur': "#7cb5ec", // #33a6e8
    'standaardLijnKleur': "black",
    'geselecteerdKleur': "#317eac",
    'foutKleur': "#b94a48", //#b83d3a
    'juistKleur': "#468847",
    'tekstKleur': "black"
};

$(function() {
    $(".determinatietabel").each(function(index, item) {
        var url = $(item).attr("data-url");
        var postUrl = $(item).attr("data-post-url");
        var postName = $(item).attr("data-post-name");
        var antwoord = $(item).attr("data-antwoord");
        var readonly = $(item).attr("read-only") !== undefined;
        var gebruikerAntwoord = $(item).attr("data-gebruikerantwoord");
        $(item).removeAttr("data-antwoord");
        $(item).removeAttr("data-gebruikerantwoord");
        $(item).html("<img src='/Content/ajax-loader.gif' class='center-block' />");
        $.getJSON(url, {}, function(data) {
            $(item).html("");
            var determinatieTabel = new DeterminatieTabel(item, data, postUrl, postName);
            determinatieTabel.teken();

            if (readonly)
                $(item).css("pointer-events", "none");
            else if (antwoord != 0 && gebruikerAntwoord != 0) {
                determinatieTabel.valideer(gebruikerAntwoord, antwoord);
                if (antwoord == gebruikerAntwoord) {
                    determinatieTabel.paper.off("cell:pointerclick");
                    $(item).css("pointer-events", "none");
                    var container = $("body");
                    var scrollTo = $("h4").first();


                    container.animate({
                        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                    });
                }
            }
        });
    });
});

function DeterminatieTabel(item, data, postUrl, postName) {
    this.container = item;
    this.rawData = data;
    this.postname = postName;
    this.postUrl = postUrl;
    this.boom = maakBoom(data);
    this.logBoom = function() {
        console.log(this.boom);
    };
    this.graph = new joint.dia.Graph;


    this.teken = function() {
        var form = $("<form style=\"display:none\" method=\"post\" action=\"" + this.postUrl + "\"><input type=\"text\" name=\"" + this.postname + "\" /><input type=\"submit\"/></form>");
        $(item).append(form);
        var grid = new LayoutGrid();
        grid.maakGrid(this.boom);
        var items = this.boom.geefItems();
        this.paper = new joint.dia.Paper({
            el: $(item),
            model: this.graph,
            width: (grid.maxX + 1) * (grid.width + grid.marginright),
            height: grid.y * (grid.height + grid.marginbottom) * 0.9,
            gridSize: 1,
            interactive: false
        });
        var self = this;
        this.paper.off("cell:highlight");
        this.paper.off("cell:mouseover");

        this.paper.on("cell:pointerclick",
            function(cellView) {
                if (cellView.model.innernode !== undefined) {
                    self.boom.clear();
                    var n = cellView.model.innernode;
                    n.vulMetKleur(kleuren.geselecteerdKleur, null);
                    if (n.data.vegetatieType !== undefined) {
                        var h = $(form).find("input[type=text]");
                        $(h).val(n.data.id);
                        $(form).submit();
                    }
                }
            }
        );
        this.paper.scale(0.8);
        $(item).css("pointer-events", "auto");
        this.graph.addCells(items);
    };

    this.valideer = function(g, s) {
        var items = this.boom.geefItems();
        var gebruiker = null;
        var systeem = null;

        $(items).each(function(i, item) {
            var t = item.innernode;
            if (t !== undefined) {
                if (t.data.id == g) {
                    gebruiker = t;

                }
                if (t.data.id == s)
                    systeem = t;
            }
        });
        if (gebruiker !== null)
            gebruiker.vulMetKleur(kleuren.juistKleur, null);
        if (gebruiker !== systeem)
            systeem.valideer(kleuren.foutKleur, null);
    };
}

function Node(data, ja, nee) {
    this.data = data;
    this.ja = ja;
    this.nee = nee;
    this.parent = null;
    this.toString = function() {
        function parameterToString(parameter) {
            if (parameter.Waarde !== undefined)
                return parameter.Waarde;
            return parameter.ParameterId;
        }

        function operatorToString(operator) {
            switch (operator) {
            case 0:
                return "<";
            case 1:
                return "=";
            case 2:
                return "≤";
            case 3:
                return ">";
            case 4:
                return "≥";
            default:
                return "≠";

            }
        }

        if (data.LinkerParameter !== undefined) {
            return parameterToString(data.LinkerParameter) + " " + operatorToString(data.Operator) + " " + parameterToString(data.RechterParameter);
        }

        return data.klimaatType;
    };
    this.rect = new joint.shapes.basic.Rect({
        position: { x: 2, y: 11 },
        size: { width: 200, height: 40 },
        attrs: { rect: { fill: kleuren.standaardKnoopKleur, stroke: kleuren.standaardLijnKleur, 'stroke-width': 1 }, text: { text: this.toString(), fill: kleuren.tekstKleur } },
    });
    this.clear = function() {
        this.rect.attr({ rect: { fill: kleuren.standaardKnoopKleur } });
        if (this.linkJa !== undefined) {
            this.linkJa.attr({
                '.connection': { stroke: kleuren.standaardLijnKleur, 'stroke-width': 1 },
                '.marker-target': { fill: kleuren.standaardLijnKleur, d: "M 10 0 L 0 5 L 10 10 z" }
            });
            this.ja.clear();
        }
        if (this.linkNee !== undefined) {
            this.linkNee.attr({
                '.connection': { stroke: kleuren.standaardLijnKleur, 'stroke-width': 1 },
                '.marker-target': { fill: kleuren.standaardLijnKleur, d: "M 10 0 L 0 5 L 10 10 z" }
            });
            this.nee.clear();
        }
    };
    this.valideer = function(kleur, kind) {
        var link = null;
        if (kind !== null) {
            if (kind === this.ja) {
                link = this.linkJa;
            } else if (kind === this.nee) {
                link = this.linkNee;
            }
        }
        var k = this.rect.toJSON().attrs.rect.fill;
        if (k !== kleuren.standaardKnoopKleur) {
            this.clear();
            this.rect.attr({
                rect: { fill: kleur }
            });
        } else if (this.parent !== null && this.parent !== undefined) {
            this.parent.valideer(kleur, this);
        }
    };
    this.rect.innernode = this;
    if (ja !== null && ja !== undefined) {
        ja.parent = this;
        this.linkJa = new joint.dia.Link({
            source: { id: this.rect.id },
            target: { id: ja.rect.id },
            labels: [
                {
                    position: .5,
                    attrs: {
                        text: { fill: kleuren.tekstKleur, text: "Ja" }
                    }
                }
            ]
        });
        this.linkJa.attr({
            '.connection': { stroke: kleuren.standaardLijnKleur, 'stroke-width': 1 },
            '.marker-target': { fill: kleuren.standaardLijnKleur, d: "M 10 0 L 0 5 L 10 10 z" }
        });
    }

    if (nee !== null && nee !== undefined) {
        this.linkNee = new joint.dia.Link({
            source: { id: this.rect.id },
            target: { id: nee.rect.id },
            labels: [
                {
                    position: .5,
                    attrs: {
                        text: { fill: kleuren.tekstKleur, text: "Nee" }
                    }
                }
            ]
        });
        this.linkNee.attr({
            '.connection': { stroke: kleuren.standaardLijnKleur, 'stroke-width': 1 },
            '.marker-target': { fill: kleuren.standaardLijnKleur, d: "M 10 0 L 0 5 L 10 10 z" }
        });

        nee.parent = this;
    }


    this.geefItems = function() {
        var items = Array();

        items.push(this.rect);
        if (this.ja !== null) {
            items = items.concat(this.ja.geefItems());
            items.push(this.linkJa);
        }
        if (this.nee !== null) {
            items = items.concat(this.nee.geefItems());
            items.push(this.linkNee);
        }

        return items;
    };
    this.vulMetKleur = function(kleur, kind) {
        var link = null;
        if (kind !== null) {
            if (kind === this.ja) {
                link = this.linkJa;
            } else if (kind === this.nee) {
                link = this.linkNee;
            }
        }

        this.rect.attr({
            rect: { fill: kleur }
        });
        if (link !== null) {
            link.attr({
                '.connection': { stroke: kleur, 'stroke-width': 1 },
                '.marker-target': { fill: kleur, d: "M 10 0 L 0 5 L 10 10 z" }
            });
        }
        if (this.parent !== null)
            this.parent.vulMetKleur(kleur, this);
    };
}

function maakBoom(data) {
    if (data === null || data === undefined)
        return null;
    var d = data.Vergelijking !== undefined ? data.Vergelijking : { id: data.DeterminatieKnoopId, klimaatType: data.KlimaatType, vegetatieType: data.VegetatieType };
    var jaKnoop = maakBoom(data.JaKnoop);
    var neeKnoop = maakBoom(data.NeeKnoop);
    return new Node(d, jaKnoop, neeKnoop);
}

function LayoutGrid() {
    this.resultaatSet = Array();
    this.x = 0;
    this.maxX = 0;
    this.y = 0;
    this.width = 200;
    this.height = 40;
    this.marginright = 50;
    this.marginbottom = 5;
    this.maakGrid = function(node) {
        this.voegNodeToe(node);
        var self = this;
        $(this.resultaatSet).each(function(index, item) {
            var y = item[1];
            var i = item[0];
            i.rect.translate((self.maxX * (self.width + self.marginright)), y);
        });
    };

    this.voegNodeToe = function(node) {
        if (node === null) return;

        if (node.data.klimaatType !== undefined) {
            this.resultaatSet.push([node, (this.y * (this.height + this.marginbottom))]);
            node.rect.resize(400, this.height);
        } else {
            node.rect.translate((this.x * (this.width + this.marginright)), (this.y * (this.height + this.marginbottom)));
        }
        var xprev = this.x;
        this.x++;
        if (this.x > this.maxX)
            this.maxX = this.x;
        this.voegNodeToe(node.ja);
        this.x = xprev;
        this.y++;
        if (node.nee !== undefined && node.nee !== null && node.nee.data.klimaatType !== undefined) {
            var w = ((this.x) * (this.width + this.marginright)) + (this.width) / 2 + 2;
            var h = (this.y * (this.height + this.marginbottom)) + (this.height / 2) + 10;
            node.linkNee.set("vertices", [{ x: w, y: h }]);
        }
        this.voegNodeToe(node.nee);
    };
}