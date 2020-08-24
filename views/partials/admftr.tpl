<!-- admftr.tpl  -->

        <footer class="py-4 bg-light mt-auto">
            <div class="container-fluid">
                <div class="d-flex align-items-center justify-content-between small">
                    <div class="text-muted">Copyright &copy; Webcliq 2020</div>
                    <div id="adminfooter">
                        @foreach($footermenu as $fid => $fmnu)
                        &middot;&nbsp;<a href="#" class="cliqbutton" data-module="@($fmnu.module)" data-label="@raw(Q::cStr($fmnu.label))" data-url="@($fmnu.url)" id="@($fid)">@raw(Q::cStr($fmnu.label))</a>
                        @endforeach
                    </div>
                </div>
            </div>
        </footer>
    </div>
</div>