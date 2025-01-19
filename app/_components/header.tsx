"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  HeartIcon,
  HomeIcon,
  Loader2,
  LogInIcon,
  LogOutIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import NavLink from "./nav-link";
import Search from "./search";
import { FiMenu } from "react-icons/fi";

interface HeaderProps {
  search?: boolean;
  searchParams?: string;
}

function Header({ search = true, searchParams }: HeaderProps) {
  const { data, status } = useSession();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = () => {
    setLoadingLogin(true);
    signIn("google");
  };

  const handleSignOut = () => {
    setLoadingLogout(true);
    signOut();
  };

  const isLogged = data?.user ? true : false;

  return (
    <div className="flex items-center justify-between px-5 pb-4 pt-4 laptop:px-44">
      <Link href={"/"}>
        <Image src="/logo.png" alt="iclone" width={50} height={50} />
      </Link>

      {search && (
        <div className="hidden w-1/2 laptop:block">
          <Search
            defaultValues={{
              search: searchParams ?? "",
            }}
          />
        </div>
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={"icon"}
            variant={"outline"}
            className="border-none bg-transparent [&_svg]:size-6"
          >
            <FiMenu />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>

          {data?.user ? (
            <>
              <div className="flex items-center gap-3 pt-6">
                <Avatar>
                  <AvatarImage src={data?.user?.image as string | undefined} />
                  <AvatarFallback>
                    {data?.user?.name?.split("")[0][0]}
                    {data?.user?.name?.split("")[1][0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold">{data?.user?.name}</h3>
                  <span className="block truncate text-xs text-muted-foreground">
                    {data?.user?.email}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pt-10">
                <h2 className="font-semibold">Olá. Faça seu login</h2>
                <Button size={"icon"} onClick={handleLogin}>
                  {loadingLogin ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <LogInIcon />
                  )}
                </Button>
              </div>
            </>
          )}

          <div className="py-6">
            <Separator />
          </div>

          <div className="space-y-2">
            <NavLink Icon={HomeIcon} title={"Início"} href={"/"} />

            {isLogged && (
              <>
                <NavLink
                  Icon={ScrollTextIcon}
                  title={"Meus pedidos"}
                  href={"/my-orders"}
                />
                <NavLink
                  Icon={HeartIcon}
                  title={"Restaurantes favoritos"}
                  href={"/my-favorite-restaurants"}
                />
              </>
            )}
          </div>

          <div className="py-6">
            <Separator />
          </div>

          {isLogged && (
            <Button
              variant={"ghost"}
              className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
              onClick={handleSignOut}
              disabled={loadingLogout}
            >
              {loadingLogout ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOutIcon size={16} className="min-h-[16px] min-w-[16px]" />
              )}
              <span className="truncate">Sair da conta</span>
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Header;
