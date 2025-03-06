import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="flex flex-col h-full w-full mx-auto max-w-md">
      <div className="relative h-40 w-full">
        <img
          src="/ucn-logo.png"
          alt="Logo Universidad Católica del Norte"
          className="absolute z-10 w-24 h-24 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        />
        <img
          src="/ucn-guayacan.jpg"
          alt="Universidad Católica del Norte, Campus Guayacán"
          className="w-full h-full object-cover brightness-30"
        />
      </div>
      <div className="flex flex-col justify-center h-full space-y-5 px-10">
        <h1 className="text-center text-3xl text-amber-700 font-black">
          ¡Hola!
        </h1>
        <p className="text-center">
          Inicia sesión con tus credenciales de Online UCN
        </p>

        <form className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <Label className="font-medium">Rut</Label>
            <Input className="h-11" />
          </div>
          <div className="flex flex-col space-y-1">
            <Label className="font-medium">Contraseña</Label>
            <Input className="h-11" type="password" />
          </div>
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-1">
              <Checkbox />
              <Label>Recuérdame</Label>
            </div>
            <a className="text-amber-600 cursor-pointer hover:underline">
              Olvidé mi contraseña
            </a>
          </div>
          <Button className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-md text-white cursor-pointer hover:from-amber-600 hover:via-amber-700 hover:to-amber-800">
            Iniciar sesión
          </Button>
        </form>
        <p className="text-center">
          ¿No tienes acceso?{" "}
          <a className="text-amber-600 cursor-pointer hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
