///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

class View3DTest
{

    private view        : away.containers.BasicView3D;
    private torus       : away.primitives.TorusGeometry;

    private mesh        : away.entities.Mesh;
    private light       : away.lights.PointLight;
    private raf         : away.utils.RequestAnimationFrame;

    constructor()
    {

        away.Debug.THROW_ERRORS     = false;
        away.Debug.LOG_PI_ERRORS    = false;

        this.light                  = new away.lights.PointLight();
        this.view                   = new away.containers.BasicView3D( )
        this.view.backgroundColor   = 0xff00ea;
        this.torus                  = new away.primitives.TorusGeometry();

        var l       : number        = 20;
        var radius  : number        = 500;

        for (var c : number = 0; c < l ; c++)
        {
            var t   : number=Math.PI * 2 * c / l;

            var m : away.entities.Mesh = new away.entities.Mesh( this.torus );
                m.x = Math.cos(t)*radius;
                m.y = 0;
                m.z = Math.sin(t)*radius;
            this.view.scene.addChild( m );
        }

        this.view.scene.addChild( this.light );

        this.view.y         = this.view.x = 0;
        this.view.width     = window.innerWidth;
        this.view.height    = window.innerHeight;

        console.log( 'renderer ' , this.view.renderer );
        console.log( 'scene ' , this.view.scene );
        console.log( 'view ' , this.view );

        this.view.render();



        document.onmousedown = ( e ) => this.onMouseDowm( e );

        //this.raf = new away.utils.RequestAnimationFrame( this.tick , this );
        //this.raf.start();

    }

    private onMouseDowm( e )
    {

        if ( this.raf)
        {

            if ( this.raf.active )
            {
                this.raf.stop();
            }
            else
            {
                this.raf.start();
            }

        }

        this.tick ( e );

    }

    private tick( e )
    {

        this.view.render();

        console.log('------------------------------------------------------------------------------------------');
        console.log('-Render' , this.view);

    }

    public resize( e )
    {

        this.view.y         = this.view.x = 0;
        this.view.width     = window.innerWidth;
        this.view.height    = window.innerHeight;
        this.view.render();

    }

}


var test: View3DTest;
window.onload = function ()
{
    test = new View3DTest();
}

window.onresize = function ( e )
{
    if ( test )
    {
        test.resize( e );
    }
}

