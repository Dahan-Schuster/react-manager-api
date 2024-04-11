let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
let UltiSnipsEnableSnipMate =  1 
let UltiSnipsJumpForwardTrigger = "<c-j>"
let UltiSnipsRemoveSelectModeMappings =  1 
let NvimTreeSetup =  1 
let UltiSnipsExpandTrigger = "<tab>"
let UltiSnipsDebugServerEnable =  0 
let UltiSnipsJumpBackwardTrigger = "<c-k>"
let Coc_tsserver_path = "/home/sarin/.config/coc/extensions/node_modules/coc-tsserver/node_modules/typescript/bin/tsc"
let UltiSnipsDebugHost = "localhost"
let UltiSnipsListSnippets = "<c-tab>"
let UltiSnipsEditSplit = "vertical"
let MyMinpacSetupPluginLoaded =  1 
let UltiSnipsPMDebugBlocking =  0 
let UltiSnipsDebugPort =  8080 
let NvimTreeRequired =  1 
silent only
silent tabonly
cd ~/code/quaestum/nagumo/projeto-padrao-api
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 app/Exceptions/Handler.ts
badd +25 env.ts
badd +1 fugitive:///home/sarin/code/quaestum/nagumo/projeto-padrao-api/.git//
badd +9 ~/code/quaestum/nagumo/projeto-padrao-api/database/migrations/1712858685192_jwt_tokens.ts
argglobal
%argdel
edit ~/code/quaestum/nagumo/projeto-padrao-api/database/migrations/1712858685192_jwt_tokens.ts
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
split
1wincmd k
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 20 + 22) / 44)
exe '2resize ' . ((&lines * 20 + 22) / 44)
argglobal
balt env.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 10 - ((9 * winheight(0) + 10) / 20)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 10
normal! 011|
wincmd w
argglobal
if bufexists(fnamemodify("fugitive:///home/sarin/code/quaestum/nagumo/projeto-padrao-api/.git//", ":p")) | buffer fugitive:///home/sarin/code/quaestum/nagumo/projeto-padrao-api/.git// | else | edit fugitive:///home/sarin/code/quaestum/nagumo/projeto-padrao-api/.git// | endif
if &buftype ==# 'terminal'
  silent file fugitive:///home/sarin/code/quaestum/nagumo/projeto-padrao-api/.git//
endif
balt app/Exceptions/Handler.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr=<<<<<<<<,>>>>>>>>
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 12 - ((8 * winheight(0) + 10) / 20)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 12
normal! 0
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 20 + 22) / 44)
exe '2resize ' . ((&lines * 20 + 22) / 44)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
