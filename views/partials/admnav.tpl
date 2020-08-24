<!-- Admnav.Tpl  -->

<!-- Top nav  -->
<nav class="sb-topnav navbar navbar-expand navbar-dark bg-primary">

    <a class="navbar-brand" href="/desktop/@($idiom)/"><img src="/views/img/@($desktop.logo)" alt="/views/img/@($desktop.logo)" title="@($title)" class="img-responsive" style="height: 50px;"/></a>

    <button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#"><i class="fas fa-bars text-danger"></i></button>
    
    <!-- Navbar Search-->
    <form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
        <div class="input-group">
            <input class="form-control" type="text" placeholder="@($desktop.search)..." aria-label="Search" aria-describedby="@($desktop.search)" id="desktop_search"/>
            <div class="input-group-append">
                <button class="btn btn-warning" type="button" id="desktop_search_button"><i class="fas fa-search"></i></button>
                <button class="btn btn-warning" type="button" id="desktop_clear_button"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    </form>

    <!-- Navbar-->
    <ul class="navbar-nav ml-auto ml-md-0">
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="@raw($avatar)" alt="@raw($username)" title="@($username)" class="" style="height: 30px;" /></a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                @foreach($usermenu as $i => $itm)
                <a class="dropdown-item cliqbutton" data-module="@($itm.module)" data-table="@($itm.table)" data-tabletype="@($itm.tabletype)" data-displaytype="@($itm.displaytype)" data-user="@($username)" id="@($i)" href="#"><i class="fas fa-fw fa-@($itm.icon)"></i>&nbsp;@raw(Q::cStr($itm.label))</a>
                @endforeach
            </div>
        </li>
    </ul>
</nav>

<style>
    #layoutSidenav_nav .nav-link {
        height: 32px;
    }
</style>
<!-- Side Navigation  -->
<div id="layoutSidenav" class="">
    <div id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
            <div class="sb-sidenav-menu">
                <div class="nav pt-4">

                    @foreach($sidemenu as $id => $mnu)

                        @if($mnu.submenu == false)

                            <a class="nav-link cliqbutton" href="#" data-module="@($mnu.module)" data-table="@($mnu.table)" data-tabletype="@($mnu.tabletype)" data-displaytype="@($mnu.displaytype)" id="@($id)">
                                <div class="sb-nav-link-icon">
                                    <i class="fas fa-fw fa-@($mnu.icon)"></i>
                                </div>
                                &nbsp;@raw(Q::cStr($mnu.label))
                            </a>
                        @else

                            <a class="nav-link collapsed" href="#" id="@($id)" data-toggle="collapse" data-target="#collapse@($id)" aria-expanded="false" aria-controls="collapse@($id)">
                                <div class="sb-nav-link-icon"><i class="fas fa-fw fa-@($mnu.icon)"></i></div>
                                &nbsp;@raw(Q::cStr($mnu.label))
                                <div class="sb-sidenav-collapse-arrow">
                                    <i class="fas fa-angle-down"></i>
                                </div>
                            </a>

                                <div class="collapse" id="collapse@($id)" data-parent="#sidenavAccordion">
                                    <nav class="sb-sidenav-menu-nested nav">

                                        @foreach($sidemenu[$id] as $sid => $submnu)

                                            @if($submnu.label != '')
                                                <a class="nav-link cliqbutton" href="#" data-module="@($submnu.module)" data-table="@($submnu.table)" data-tabletype="@($submnu.tabletype)" data-displaytype="@($submnu.displaytype)" id="@($sid)">
                                                    <div class="sb-nav-link-icon">
                                                        <i class="fas fa-fw fa-@($submnu.icon)"></i>
                                                    </div>
                                                    &nbsp;@raw(Q::cStr($submnu.label))
                                                </a>
                                            @endif

                                        @endforeach

                                    </nav>
                                </div>

                        @endif

                    @endforeach

                </div>
            </div>

            <div class="sb-sidenav-footer">
                <div class="small">Logged in as:</div>
                Admin
            </div>

        </nav>
    </div>

    <!-- Start of Content secion  -->
    <div id="layoutSidenav_content">